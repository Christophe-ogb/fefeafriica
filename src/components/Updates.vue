<script setup lang="ts">
import { ArrowUpRight, CalendarDays, Radio } from '@lucide/vue'

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

      <div class="updates-note">
        <div class="updates-note-icon"><CalendarDays :size="18" /></div>
        <div>
          <span class="updates-note-label"><Radio :size="12" /> ACTUALITÉS & AGENDA</span>
          <p>
            Les dates et annonces seront relayées ici lorsqu’elles seront confirmées. En attendant,
            retrouvez les informations de chaque initiative sur ses espaces officiels.
          </p>
        </div>
      </div>

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
