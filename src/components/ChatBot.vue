<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from 'vue'
import { Bot, MessageCircle, Send, X } from '@lucide/vue'

type MessageRole = 'user' | 'assistant'

interface ChatMessage {
  id: number
  role: MessageRole
  content: string
}

interface SavedConversation {
  messages: ChatMessage[]
  lastActivityAt: number
}

const conversationStorageKey = 'fefe-afriica-chat'
const conversationTimeout = 10 * 60 * 1000
const welcomeMessage: ChatMessage = {
  id: 0,
  role: 'assistant',
  content: 'Bonjour ! Je suis Fèfè Bot. Comment puis-je vous orienter parmi nos trois filiales ?',
}

const errorMessage =
  'Désolé, une erreur est survenue. Veuillez réinstaller ou contacter le support via WhatsApp.'
const whatsappUrl = 'https://wa.me/2290196673658?text=Bonjour%20F%C3%A8f%C3%A8%20Afriica%2C%20je%20souhaite%20obtenir%20des%20informations.'

function loadConversation(): SavedConversation {
  const now = Date.now()

  try {
    const saved = localStorage.getItem(conversationStorageKey)
    if (saved) {
      const parsed: unknown = JSON.parse(saved)
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        'messages' in parsed &&
        Array.isArray(parsed.messages) &&
        'lastActivityAt' in parsed &&
        typeof parsed.lastActivityAt === 'number' &&
        Number.isFinite(parsed.lastActivityAt) &&
        parsed.messages.every(
          (message) =>
            typeof message === 'object' &&
            message !== null &&
            'id' in message &&
            typeof message.id === 'number' &&
            'role' in message &&
            (message.role === 'user' || message.role === 'assistant') &&
            'content' in message &&
            typeof message.content === 'string',
        ) &&
        parsed.messages.length > 0 &&
        now - parsed.lastActivityAt < conversationTimeout
      ) {
        return {
          messages: parsed.messages,
          lastActivityAt: parsed.lastActivityAt,
        }
      }

      localStorage.removeItem(conversationStorageKey)
    }
  } catch (error) {
    console.error('Unable to restore the saved chat conversation.', error)
  }

  return { messages: [welcomeMessage], lastActivityAt: now }
}

const savedConversation = loadConversation()
const isOpen = ref(false)
const isLoading = ref(false)
const draft = ref('')
const messages = ref<ChatMessage[]>(savedConversation.messages)
const lastActivityAt = ref(savedConversation.lastActivityAt)
const chatInput = ref<HTMLInputElement | null>(null)
const chatWindow = ref<HTMLElement | null>(null)
const toggleButton = ref<HTMLButtonElement | null>(null)
let nextMessageId = Math.max(...messages.value.map((message) => message.id)) + 1
let conversationGeneration = 0
let expirationTimer: ReturnType<typeof setTimeout> | undefined

function resetConversation() {
  conversationGeneration += 1
  lastActivityAt.value = Date.now()
  messages.value = [welcomeMessage]
}

function scheduleConversationExpiration() {
  if (expirationTimer) clearTimeout(expirationTimer)

  const remaining = conversationTimeout - (Date.now() - lastActivityAt.value)
  if (remaining <= 0) {
    resetConversation()
    return
  }

  expirationTimer = setTimeout(scheduleConversationExpiration, remaining)
}

watch(
  [messages, lastActivityAt],
  ([savedMessages, activityAt]) => {
    try {
      localStorage.setItem(
        conversationStorageKey,
        JSON.stringify({ messages: savedMessages, lastActivityAt: activityAt }),
      )
    } catch (error) {
      console.error('Unable to save the chat conversation in this browser.', error)
    }

    scheduleConversationExpiration()
  },
  { deep: true, immediate: true },
)

onUnmounted(() => {
  if (expirationTimer) clearTimeout(expirationTimer)
})

watch(isOpen, async (open) => {
  await nextTick()
  if (open) chatInput.value?.focus()
  else toggleButton.value?.focus()
})

watch(
  () => [messages.value.length, isLoading.value],
  async () => {
    await nextTick()
    if (chatWindow.value) chatWindow.value.scrollTop = chatWindow.value.scrollHeight
  },
)

function closeChat() {
  isOpen.value = false
}

async function sendMessage() {
  const content = draft.value.trim()
  if (!content || isLoading.value) return

  if (Date.now() - lastActivityAt.value >= conversationTimeout) resetConversation()

  const requestGeneration = conversationGeneration
  messages.value.push({ id: nextMessageId++, role: 'user', content })
  lastActivityAt.value = Date.now()
  draft.value = ''
  isLoading.value = true
  let failureMessage = errorMessage

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages.value.map(({ role, content: messageContent }) => ({
          role,
          content: messageContent,
        })),
      }),
    })

    const data: unknown = await response.json()
    if (!response.ok) {
      if (
        typeof data === 'object' &&
        data !== null &&
        'error' in data &&
        typeof data.error === 'string' &&
        data.error.trim()
      ) {
        failureMessage = data.error.trim()
      }
      throw new Error(`Chat API returned ${response.status}`)
    }

    if (
      typeof data !== 'object' ||
      data === null ||
      !('reply' in data) ||
      typeof data.reply !== 'string' ||
      !data.reply.trim()
    ) {
      throw new Error('Chat API returned an invalid reply')
    }

    if (requestGeneration === conversationGeneration) {
      messages.value.push({ id: nextMessageId++, role: 'assistant', content: data.reply.trim() })
      lastActivityAt.value = Date.now()
    }
  } catch (error) {
    console.error('Unable to get a response from the chat API.', error)
    if (requestGeneration === conversationGeneration) {
      messages.value.push({ id: nextMessageId++, role: 'assistant', content: failureMessage })
      lastActivityAt.value = Date.now()
    }
  } finally {
    isLoading.value = false
    await nextTick()
    chatInput.value?.focus()
  }
}
</script>

<template>
  <Transition name="chat-window">
    <section
      v-if="isOpen"
      id="chat-dialog"
      class="chat-panel fixed bottom-24 right-3 z-50 flex flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/95 text-slate-100 shadow-2xl backdrop-blur-md sm:bottom-24 sm:right-6"
      role="dialog"
      aria-modal="false"
      aria-labelledby="chat-title"
      tabindex="-1"
      @keydown.esc.stop.prevent="closeChat"
    >
      <header class="flex shrink-0 items-center justify-between border-b border-slate-700 px-4 py-3.5">
        <div class="flex min-w-0 items-center gap-3">
          <span class="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
            <Bot :size="21" aria-hidden="true" />
          </span>
          <div class="min-w-0">
            <h2 id="chat-title" class="truncate text-sm font-semibold">Fèfè Bot</h2>
            <p class="flex items-center gap-1.5 text-xs text-slate-400">
              <span class="size-2 rounded-full bg-emerald-400" aria-hidden="true"></span>
              Assistant IA · En ligne
            </p>
          </div>
        </div>
        <button
          class="grid size-9 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
          type="button"
          aria-label="Fermer la discussion"
          @click="closeChat"
        >
          <X :size="19" aria-hidden="true" />
        </button>
      </header>

      <div
        ref="chatWindow"
        class="chat-messages flex-1 space-y-4 overflow-y-auto px-4 py-4"
        role="log"
        aria-label="Conversation avec Fèfè Bot"
        aria-live="polite"
        aria-relevant="additions text"
      >
        <div v-for="message in messages" :key="message.id" class="flex" :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
          <p
            class="max-w-[86%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
            :class="
              message.role === 'user'
                ? 'rounded-br-md bg-emerald-700 text-white'
                : 'rounded-bl-md bg-slate-800 text-slate-200'
            "
          >
            {{ message.content }}
          </p>
        </div>

        <div v-if="isLoading" class="flex justify-start" role="status" aria-label="Fèfè Bot rédige une réponse">
          <div class="flex items-center gap-1 rounded-2xl rounded-bl-md bg-slate-800 px-4 py-3">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="sr-only">Fèfè Bot rédige une réponse</span>
          </div>
        </div>
      </div>

      <div class="border-t border-slate-700 px-3.5 py-3">
        <form class="flex items-center gap-2" @submit.prevent="sendMessage">
          <label class="sr-only" for="chat-message">Votre message</label>
          <input
            id="chat-message"
            ref="chatInput"
            v-model="draft"
            class="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60"
            type="text"
            maxlength="1200"
            autocomplete="off"
            placeholder="Écrivez votre message..."
            :disabled="isLoading"
          />
          <button
            class="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            aria-label="Envoyer le message"
            :disabled="isLoading || !draft.trim()"
          >
            <Send :size="18" aria-hidden="true" />
          </button>
        </form>
        <div class="mt-2 flex items-center justify-between gap-2 text-[11px] text-slate-500">
          <span>Entrée pour envoyer · Échap pour fermer</span>
          <div class="flex shrink-0 items-center gap-3">
            <a class="text-slate-300 hover:text-white" href="#contact">Formulaire</a>
            <a
              class="inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-200"
              :href="whatsappUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle :size="12" aria-hidden="true" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  </Transition>

  <button
    ref="toggleButton"
    class="fixed bottom-6 right-6 z-50 grid size-14 place-items-center rounded-full bg-emerald-700 text-white shadow-lg shadow-emerald-950/25 transition hover:scale-105 hover:bg-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500"
    type="button"
    :aria-expanded="isOpen"
    aria-controls="chat-dialog"
    :aria-label="isOpen ? 'Fermer Fèfè Bot' : 'Ouvrir Fèfè Bot, assistant IA'"
    @click="isOpen = !isOpen"
  >
    <MessageCircle v-if="!isOpen" :size="25" aria-hidden="true" />
    <X v-else :size="23" aria-hidden="true" />
    <span class="absolute -right-1 -top-1 rounded-full border-2 border-white bg-amber-300 px-1.5 py-0.5 text-[9px] font-bold leading-none text-slate-900">
      IA
    </span>
  </button>
</template>

<style scoped>
.chat-panel {
  width: min(380px, calc(100vw - 24px));
  height: min(560px, calc(100dvh - 116px));
  min-height: min(340px, calc(100dvh - 116px));
}

.chat-window-enter-active,
.chat-window-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.chat-window-enter-from,
.chat-window-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.96);
}

.typing-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #94a3b8;
  animation: typing-bounce 1s infinite ease-in-out;
}

.typing-dot:nth-child(2) {
  animation-delay: 120ms;
}

.typing-dot:nth-child(3) {
  animation-delay: 240ms;
}

@keyframes typing-bounce {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-4px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .chat-window-enter-active,
  .chat-window-leave-active {
    transition-duration: 1ms;
  }

  .typing-dot {
    animation: none;
  }
}
</style>
