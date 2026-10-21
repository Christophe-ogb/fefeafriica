<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { ArrowUpRight, Mail, MapPin, MessageCircle } from '@lucide/vue'

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

const props = defineProps<{ selectedTopic?: string }>()
const whatsappNumber = '2290141757539'
const directWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Bonjour Fèfè Afriica, je souhaite obtenir des informations.')}`

const form = reactive<ContactForm>({
  name: '',
  email: '',
  subject: '',
  message: '',
})

watch(
  () => props.selectedTopic,
  (topic) => {
    if (topic) form.subject = topic
  },
)

const errors = reactive<Partial<Record<keyof ContactForm, string>>>({})
const feedback = ref('')

function validateForm() {
  Object.keys(errors).forEach((key) => delete errors[key as keyof ContactForm])

  if (form.name.trim().length < 2) errors.name = 'Indiquez votre nom (au moins 2 caractères).'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Vérifiez le format de votre adresse e-mail.'
  }
  if (!form.subject) errors.subject = 'Choisissez une filiale ou un sujet.'
  if (form.message.trim().length < 10) {
    errors.message = 'Votre message doit contenir au moins 10 caractères.'
  }

  return Object.keys(errors).length === 0
}

function submitForm() {
  feedback.value = ''

  if (!validateForm()) {
    feedback.value = 'Quelques informations sont à vérifier avant de continuer.'
    return
  }

  const message = [
    'Bonjour Fèfè Afriica,',
    '',
    `Nom : ${form.name.trim()}`,
    `E-mail : ${form.email.trim()}`,
    `Sujet : ${form.subject}`,
    '',
    'Message :',
    form.message.trim(),
  ].join('\n')

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
  const whatsappWindow = window.open(whatsappUrl, '_blank')

  if (whatsappWindow) {
    whatsappWindow.opener = null
  } else {
    window.location.assign(whatsappUrl)
  }
}
</script>

<template>
  <section id="contact" class="contact section-shell" aria-labelledby="contact-title">
    <div class="contact-heading">
      <div>
        <span class="eyebrow"><span class="eyebrow-dot"></span> Une idée, une question, un projet ?</span>
        <h2 id="contact-title">La conversation<br /><em>commence ici.</em></h2>
      </div>
      <div class="contact-direct">
        <span>On est basés à</span>
        <strong><MapPin :size="15" /> Calavi, Bénin</strong>
        <span>Et toujours curieux des belles idées.</span>
        <a class="whatsapp-contact" :href="directWhatsappUrl" target="_blank" rel="noopener noreferrer">
          <MessageCircle :size="15" /> Écrire sur WhatsApp
        </a>
      </div>
    </div>

    <div class="contact-grid">
      <div class="contact-note">
        <div class="contact-note-mark" aria-hidden="true">“</div>
        <blockquote>Les projets solides<br />commencent souvent<br />par une simple discussion.</blockquote>
        <span class="contact-note-rule"></span>
        <span class="contact-note-caption">PARTENARIATS · COMMANDES · COLLABORATIONS</span>
        <a href="#filiales" class="contact-explore">Revoir nos filiales <ArrowUpRight :size="15" /></a>
      </div>

      <form class="contact-form flex flex-col" novalidate @submit.prevent="submitForm">
        <div class="form-row">
          <label class="form-field">
            <span>Votre nom</span>
            <input
              v-model="form.name"
              type="text"
              name="name"
              autocomplete="name"
              placeholder="Ex. Aïcha Dossou"
              :aria-invalid="!!errors.name"
              :aria-describedby="errors.name ? 'name-error' : undefined"
            />
            <small v-if="errors.name" id="name-error" class="field-error">{{ errors.name }}</small>
          </label>
          <label class="form-field">
            <span>Votre e-mail</span>
            <input
              v-model="form.email"
              type="email"
              name="email"
              autocomplete="email"
              placeholder="vous@exemple.com"
              :aria-invalid="!!errors.email"
              :aria-describedby="errors.email ? 'email-error' : undefined"
            />
            <small v-if="errors.email" id="email-error" class="field-error">{{ errors.email }}</small>
          </label>
        </div>

        <label class="form-field">
          <span>Ça concerne…</span>
          <select
            v-model="form.subject"
            name="subject"
            :aria-invalid="!!errors.subject"
            :aria-describedby="errors.subject ? 'subject-error' : undefined"
          >
            <option value="" disabled>Choisir un sujet ou une filiale</option>
            <option value="Fèfè Afriica — Partenariat">Fèfè Afriica — Partenariat</option>
            <option value="SAAKI — Commerçant, fabricant ou campagne">SAAKI — Commerçants, fabricants ou sponsors</option>
            <option value="GAGNANTS 229 — Jeux et patrimoine">GAGNANTS 229 — Jeux et patrimoine</option>
            <option value="MAAFRIK CENTERS — Formation et insertion professionnelle">MAAFRIK CENTERS — Formation et insertion professionnelle</option>
            <option value="Autre demande">Autre demande</option>
          </select>
          <small v-if="errors.subject" id="subject-error" class="field-error">{{ errors.subject }}</small>
        </label>

        <label class="form-field">
          <span>Votre message</span>
          <textarea
            v-model="form.message"
            name="message"
            rows="4"
            placeholder="Quelques lignes pour nous donner le contexte…"
            :aria-invalid="!!errors.message"
            :aria-describedby="errors.message ? 'message-error' : undefined"
          ></textarea>
          <small v-if="errors.message" id="message-error" class="field-error">{{ errors.message }}</small>
        </label>

        <div class="form-submit-row">
          <button class="button button--dark" type="submit">
            Envoyer un message <ArrowUpRight :size="16" />
          </button>
        </div>
        <p v-if="feedback" class="form-feedback" role="status">
          {{ feedback }}
        </p>
        <span class="form-privacy"><Mail :size="13" /> WhatsApp s’ouvrira avec votre message prérempli ; vous pourrez le vérifier et l’envoyer.</span>
      </form>
    </div>
  </section>
</template>
