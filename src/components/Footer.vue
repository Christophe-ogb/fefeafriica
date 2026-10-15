<script setup lang="ts">
import { ArrowUpRight, MoveUpRight } from '@lucide/vue'

defineProps<{ year: number }>()
</script>

<template>
  <footer class="site-footer">
    <div class="footer-main">
      <div class="footer-brand-block">
        <a class="brand brand--footer" href="#accueil" aria-label="Fèfè Afriica, retour en haut">
          <img class="brand-logo" src="/images/logofefeafriica-cropped.png" alt="Fèfè Afriica" />
        </a>
        <p>Des initiatives béninoises,<br />des idées qui font leur chemin.</p>
        <a class="back-to-top" href="#accueil">Retour en haut <MoveUpRight :size="14" /></a>
      </div>

      <div class="footer-nav">
        <div>
          <span class="footer-label">Explorer</span>
          <a href="#accueil">Accueil</a>
          <a href="#filiales">Nos initiatives</a>
          <a href="#parcours">Opportunités</a>
          <a href="#actualites">Suivre les projets</a>
          <a href="#apropos">Impact & à propos</a>
          <a href="#contact">Contact</a>
        </div>
        <div>
          <span class="footer-label">Les filiales</span>
          <a class="project-link project-link--saaki" href="https://saaki.bj" target="_blank" rel="noopener noreferrer">SAAKI <ArrowUpRight :size="12" /></a>
          <a class="project-link project-link--gagnants" href="https://gagnants229.com" target="_blank" rel="noopener noreferrer">GAGNANTS 229 <ArrowUpRight :size="12" /></a>
          <a class="project-link project-link--maafrik" href="https://www.facebook.com/maafrik" target="_blank" rel="noopener noreferrer">MAAFRIK CENTERS · Facebook <ArrowUpRight :size="12" /></a>
        </div>
      </div>

      <div class="footer-aside">
        <span class="footer-label">Ancrés à</span>
        <strong>Calavi, Bénin</strong>
        <span class="footer-coordinate">06° 22' N · 02° 25' E</span>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© {{ year }} Fèfè Afriica. Tous droits réservés.</span>
      <span>Fait avec intention, au Bénin <i>✳</i></span>
    </div>
  </footer>
</template>
