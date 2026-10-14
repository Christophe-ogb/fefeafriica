<script setup lang="ts">
import { ArrowUpRight, HeartHandshake } from '@lucide/vue'
</script>

<template>
  <section id="apropos" class="impact relative overflow-hidden" aria-labelledby="impact-title">
    <div class="impact-orb" aria-hidden="true"></div>
    <div class="impact-shell">
      <div class="impact-main">
        <span class="impact-kicker"><HeartHandshake :size="15" /> Notre raison d’agir</span>
        <h2 id="impact-title">L’avenir se construit<br />avec ce qu’on <em>choisit<br />de faire aujourd’hui.</em></h2>
        <p>
          Fèfè Afriica est la maison mère de trois initiatives complémentaires : MAAFRIK CENTERS
          forme et accompagne les talents, SAAKI agit pour des emballages plus durables, et
          GAGNANTS 229 fait découvrir le patrimoine béninois par le jeu.
        </p>
        <p>
          Chaque projet construit sa propre communauté. Ce portail et notre contact WhatsApp
          fédèrent les demandes ; un espace numérique partagé pourra venir plus tard, selon les
          besoins réels des activités.
        </p>
        <a class="impact-link" href="#contact">Construisons quelque chose ensemble <ArrowUpRight :size="16" /></a>
      </div>

      <div class="impact-side">
        <div class="impact-orbit" aria-hidden="true">
          <div class="orbit-ring orbit-ring--outer"></div>
          <div class="orbit-ring orbit-ring--inner"></div>
          <span class="orbit-node orbit-node--leaf">01</span>
          <span class="orbit-node orbit-node--sun">02</span>
          <span class="orbit-node orbit-node--blue">03</span>
          <span class="orbit-center">FÈFÈ<br /><strong>AFRIICA</strong></span>
        </div>
        <div class="impact-facts">
          <div><strong>SAAKI</strong><span>réduire le plastique</span></div>
          <div><strong>MAAFRIK</strong><span>former et créer</span></div>
          <div><strong>GAGNANTS 229</strong><span>transmettre par le jeu</span></div>
        </div>
        <span class="impact-side-note">ÉCOLOGIE <i>·</i> CULTURE <i>·</i> TRANSMISSION</span>
      </div>
    </div>
    <div class="impact-bottom-rule"><span></span><span>LE LOCAL EST UN POINT DE DÉPART</span><span></span></div>
  </section>
</template>
