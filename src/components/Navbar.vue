<script setup lang="ts">
import { ref } from 'vue'
import { ArrowUpRight, Menu, X } from '@lucide/vue'

const isMenuOpen = ref(false)

function closeMenu() {
  isMenuOpen.value = false
}
</script>

<template>
  <div class="site-header-group">
    <a
      class="event-topbar"
      href="https://eventreet.com/event/saaki-green-launch/395"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Lancement officiel de SAAKI le 3 novembre 2026. Réserver son pass."
    >
      <span class="event-live-dot" aria-hidden="true"></span>
      <span><strong>À VENIR · 3 NOVEMBRE 2026</strong> — Lancement officiel de SAAKI</span>
      <span class="event-topbar-action">Réserver son pass <ArrowUpRight :size="13" /></span>
    </a>
    <header class="site-header">
      <nav class="nav-shell mx-auto flex items-center justify-between" aria-label="Navigation principale">
        <a class="brand inline-flex items-center gap-2.5" href="#accueil" aria-label="Fèfè Afriica, accueil" @click="closeMenu">
          <img class="brand-logo" src="/images/logofefeafriica-cropped.png" alt="Fèfè Afriica" />
        </a>

        <button
          class="menu-toggle"
          type="button"
          :aria-expanded="isMenuOpen"
          :aria-label="isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
          @click="isMenuOpen = !isMenuOpen"
        >
          <X v-if="isMenuOpen" :size="21" />
          <Menu v-else :size="21" />
        </button>

        <div class="nav-links flex items-center gap-8" :class="{ 'nav-links--open': isMenuOpen }">
          <a href="#accueil" @click="closeMenu">Accueil</a>
          <a href="#filiales" @click="closeMenu">Nos initiatives</a>
          <a href="#parcours" @click="closeMenu">Opportunités</a>
          <a href="#actualites" @click="closeMenu">Suivre les projets</a>
          <a href="#apropos" @click="closeMenu">Impact</a>
          <a href="#contact" @click="closeMenu">Contact</a>
          <a class="nav-cta inline-flex items-center gap-2.5" href="#filiales" @click="closeMenu">
            Rejoindre l’écosystème <ArrowUpRight :size="15" />
          </a>
        </div>
      </nav>
    </header>
  </div>
</template>
