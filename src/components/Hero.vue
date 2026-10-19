<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { ArrowDown, ArrowUpRight, Leaf, Sparkles } from '@lucide/vue'

const heroImages = [
  {
    src: '/images/hero-benin-heritage.jpg',
    alt: 'Personnes en tenues traditionnelles béninoises',
  },
  {
    src: '/images/hero-benin-culture.jpg',
    alt: 'Statue en bronze d’un cavalier sur son cheval',
  },
  {
    src: '/images/amazone.jpg',
    alt: 'Statue de l’Amazone à Calavi, au Bénin',
  },
]

const activeImage = ref(0)
let slideshowTimer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  slideshowTimer = setInterval(() => {
    activeImage.value = (activeImage.value + 1) % heroImages.length
  }, 120_000)
})

onUnmounted(() => {
  if (slideshowTimer) clearInterval(slideshowTimer)
})
</script>

<template>
  <section id="accueil" class="hero relative overflow-hidden">
    <div class="hero-grain" aria-hidden="true"></div>
    <div class="hero-orb hero-orb--one" aria-hidden="true"></div>
    <div class="hero-orb hero-orb--two" aria-hidden="true"></div>

    <div class="hero-shell relative z-[1] mx-auto grid items-center">
      <div class="hero-copy">
        <div class="hero-overline">
          <span class="overline-icon"><Leaf :size="13" /></span>
          <span>Une fédération née au Bénin</span>
          <span class="overline-rule"></span>
        </div>
        <h1>Entreprendre.<br />Former. Innover.<br /><span>Impacter l’Afrique.</span></h1>
        <p class="hero-description">
          Fèfè Afriica relie des initiatives béninoises qui forment les jeunes, font avancer des
          alternatives aux emballages plastiques et font vivre le patrimoine par le jeu.
        </p>

        <div class="hero-actions flex flex-wrap items-center gap-6">
          <a class="button button--dark" href="#filiales">
            Découvrir nos initiatives <ArrowUpRight :size="17" />
          </a>
          <a class="text-link" href="#parcours">Trouver ma porte d’entrée <ArrowDown :size="15" /></a>
        </div>

        <div class="hero-signoff">
          <span class="signoff-avatars" aria-hidden="true">
            <span>F</span><span>A</span><span>+</span>
          </span>
          <span>Trois communautés. <strong>Une même maison.</strong></span>
        </div>
      </div>

      <div class="hero-art" aria-label="Créativité, culture et environnement au Bénin">
        <div class="art-backdrop" aria-hidden="true">
          <span class="art-sun"></span>
          <span class="art-grid"></span>
          <span class="art-arc"></span>
        </div>
        <figure class="hero-photo" role="group" aria-label="Images du Bénin">
          <img
            v-for="(image, index) in heroImages"
            :key="image.src"
            :src="image.src"
            :alt="image.alt"
            :class="{ 'hero-photo-image--active': activeImage === index }"
            :aria-hidden="activeImage !== index"
            :fetchpriority="index === 0 ? 'high' : 'auto'"
          />
          <figcaption>
            <span class="photo-caption-dot"></span>
            <span>Des talents d’ici.<br /><strong>Des projets pour demain.</strong></span>
          </figcaption>
        </figure>
        <div class="art-stamp" aria-hidden="true">
          <span class="stamp-icon"><Sparkles :size="18" /></span>
          <span>Imaginé<br />au Bénin</span>
        </div>
        <div class="art-note"><span>06° 22' N</span><span>Calavi · Bénin</span></div>
        <div class="art-vertical-label">CULTURE · CRÉATION · ENGAGEMENT</div>
      </div>
    </div>

    <div class="hero-bottomline" aria-hidden="true">
      <span>Entreprendre autrement, ensemble.</span>
      <span class="bottomline-center"><span></span> Calavi, Bénin <span></span></span>
      <span>Depuis nos communautés, pour demain.</span>
    </div>
  </section>
</template>
