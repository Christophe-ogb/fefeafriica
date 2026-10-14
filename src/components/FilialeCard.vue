<script setup lang="ts">
import { ArrowUpRight } from '@lucide/vue'

interface Filiale {
  name: string
  category: string
  tagline: string
  description: string
  url: string
  image: string
  imageAlt: string
  kind: 'saaki' | 'culture' | 'creative'
  detail: string
}

defineProps<{ filiale: Filiale }>()
</script>

<template>
  <article class="branch-card overflow-hidden border transition duration-300" :class="`branch-card--${filiale.kind}`">
    <div class="branch-card-top">
      <span class="branch-badge">
        <span class="badge-dot"></span>{{ filiale.category }}
      </span>
      <span class="branch-index">0{{ filiale.kind === 'saaki' ? '1' : filiale.kind === 'culture' ? '2' : '3' }}</span>
    </div>

    <template v-if="filiale.kind === 'saaki'">
      <div class="branch-feature-layout">
        <div class="branch-card-copy">
          <h3>{{ filiale.name }}</h3>
          <span class="branch-tagline">{{ filiale.tagline }}</span>
          <p>{{ filiale.description }}</p>
          <a
            class="branch-link"
            :href="filiale.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`Découvrir ${filiale.name} (nouvel onglet)`"
          >
            Découvrir SAAKI <ArrowUpRight :size="16" />
          </a>
        </div>
        <figure class="branch-image">
          <img :src="filiale.image" :alt="filiale.imageAlt" loading="lazy" />
          <figcaption><span></span> {{ filiale.detail }}</figcaption>
        </figure>
      </div>
      <div class="branch-bottom-note"><span>LE BON GESTE COMMENCE AU QUOTIDIEN</span><span>01 / 03</span></div>
    </template>

    <template v-else-if="filiale.kind === 'culture'">
      <div class="culture-mark" aria-hidden="true">229<span>°</span></div>
      <div class="branch-card-copy">
        <h3>{{ filiale.name }}</h3>
        <span class="branch-tagline">{{ filiale.tagline }}</span>
        <p>{{ filiale.description }}</p>
      </div>
      <div class="branch-card-bottom">
        <span>{{ filiale.detail }}</span>
        <a
          class="round-link"
          :href="filiale.url"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`Découvrir ${filiale.name} (nouvel onglet)`"
        ><ArrowUpRight :size="18" /></a>
      </div>
    </template>

    <template v-else>
      <figure class="creative-image">
        <img :src="filiale.image" :alt="filiale.imageAlt" loading="lazy" />
        <figcaption>Idées d’ici, imprimées ici.</figcaption>
      </figure>
      <div class="creative-content">
        <div class="branch-card-copy">
          <h3>{{ filiale.name }}</h3>
          <span class="branch-tagline">{{ filiale.tagline }}</span>
          <p>{{ filiale.description }}</p>
        </div>
        <a
          class="branch-link"
          :href="filiale.url"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`Retrouver ${filiale.name} sur Facebook (nouvel onglet)`"
        >
          Suivre MAAFRIK CENTERS <ArrowUpRight :size="16" />
        </a>
      </div>
    </template>
  </article>
</template>
