<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ArrowUpRight, CalendarDays } from '@lucide/vue'

const launchDate = new Date('2026-11-03T00:00:00+01:00')
const launchDayEnd = new Date('2026-11-04T00:00:00+01:00')
const now = ref(new Date())
let countdownTimer: ReturnType<typeof setInterval> | undefined

const countdown = computed(() => {
  const millisecondsLeft = launchDate.getTime() - now.value.getTime()

  if (millisecondsLeft <= 0) {
    return now.value.getTime() < launchDayEnd.getTime()
      ? { label: "C'est aujourd'hui !", days: null, hours: null }
      : { label: 'Le lancement est passé', days: null, hours: null }
  }

  const totalHours = Math.floor(millisecondsLeft / (1000 * 60 * 60))
  return {
    label: 'avant le lancement',
    days: Math.floor(totalHours / 24),
    hours: totalHours % 24,
  }
})

onMounted(() => {
  countdownTimer = setInterval(() => {
    now.value = new Date()
  }, 60_000)
})

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})

const channels = [
  {
    name: 'SAAKI',
    detail: 'Campagnes et informations sur les sacs écologiques',
    url: 'https://saaki.bj',
    className: 'updates-channel--saaki',
  },
  {
    name: 'GAGNANTS 229',
    detail: 'Jeux, quiz, patrimoine et rendez-vous culturels',
    url: 'https://gagnants229.com',
    className: 'updates-channel--culture',
  },
  {
    name: 'MAAFRIK CENTERS',
    detail: 'Formations, compétences numériques, création et impression',
    url: 'https://www.facebook.com/maafrik',
    className: 'updates-channel--maafrik',
  },
]
</script>

<template>
  <section id="actualites" class="updates" aria-labelledby="updates-title">
    <div class="updates-shell">
      <div class="updates-heading">
        <div>
          <span class="eyebrow"><span class="eyebrow-dot"></span> Suivre les projets</span>
          <h2 id="updates-title">Chaque projet,<br /><em>sa communauté.</em></h2>
        </div>
        <p>
          Chaque initiative garde son identité et sa communauté. Fèfè Afriica reste la porte d’entrée
          commune et vous oriente vers le bon projet et la bonne équipe.
        </p>
      </div>

      <article class="saaki-event" aria-labelledby="saaki-event-title">
        <div class="saaki-event-copy">
          <span class="saaki-event-label">
            <span class="event-live-dot" aria-hidden="true"></span>
            ÉVÉNEMENT SAAKI
          </span>
          <h3 id="saaki-event-title">Le lancement officiel de SAAKI</h3>
          <p class="saaki-event-date"><CalendarDays :size="15" /> Mardi 3 novembre 2026</p>
        </div>
        <div class="saaki-countdown" aria-live="polite">
          <template v-if="countdown.days !== null && countdown.hours !== null">
            <span class="countdown-unit"><strong>{{ countdown.days }}</strong><small>jours</small></span>
            <span class="countdown-separator" aria-hidden="true">:</span>
            <span class="countdown-unit"><strong>{{ countdown.hours }}</strong><small>heures</small></span>
            <span class="countdown-caption">{{ countdown.label }}</span>
          </template>
          <span v-else class="countdown-status">{{ countdown.label }}</span>
        </div>
        <a
          class="saaki-event-cta"
          href="https://eventreet.com/event/saaki-green-launch/395"
          target="_blank"
          rel="noopener noreferrer"
        >
          Réserver mon pass <ArrowUpRight :size="16" />
        </a>
      </article>

      <div class="updates-channels">
        <a
          v-for="channel in channels"
          :key="channel.name"
          class="updates-channel"
          :class="channel.className"
          :href="channel.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>
            <strong>{{ channel.name }}</strong>
            <small>{{ channel.detail }}</small>
          </span>
          <ArrowUpRight :size="17" />
        </a>
      </div>
    </div>
  </section>
</template>
