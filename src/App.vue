<script setup lang="ts">
import { ref } from 'vue'
import Navbar from './components/Navbar.vue'
import Hero from './components/Hero.vue'
import FilialeCard from './components/FilialeCard.vue'
import EntryPoints from './components/EntryPoints.vue'
import Updates from './components/Updates.vue'
import About from './components/About.vue'
import Contact from './components/Contact.vue'
import Footer from './components/Footer.vue'
import ChatBot from './components/ChatBot.vue'

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

const filiales: Filiale[] = [
  {
    name: 'SAAKI',
    category: 'Écologie & environnement',
    tagline: 'Un pas vers, un Bénin vert.',
    description:
      'Des sacs en papier fabriqués au Bénin pour faire reculer, concrètement, le péril plastique.',
    url: 'https://saaki.bj',
    image: '/images/saaki.jpeg',
    imageAlt: 'Sac en papier kraft, une alternative aux emballages plastiques',
    kind: 'saaki',
    detail: 'Un autre sac est possible.',
  },
  {
    name: 'GAGNANTS 229',
    category: 'Culture & patrimoine',
    tagline: 'Le patrimoine béninois devient un jeu.',
    description:
      'Des jeux, des animations et des moments à partager pour faire vivre le patrimoine béninois.',
    url: 'https://gagnants229.com',
    image: '/images/logoweb_BJ.jpg.jpeg',
    imageAlt: 'Logo de GAGNANTS 229',
    kind: 'culture',
    detail: 'Jouer, transmettre, rassembler.',
  },
  {
    name: 'MAAFRIK CENTERS',
    category: 'Formation & opportunités',
    tagline: 'Former aujourd’hui. Innover demain. Impacter l’Afrique.',
    description:
      'Compétences numériques, design, impression et entrepreneuriat : des formations pour apprendre et passer à l’action.',
    url: 'https://www.facebook.com/maafrik',
    image: '/images/maafrikcenters.png',
    imageAlt: 'Logo de MAAFRIK CENTERS',
    kind: 'creative',
    detail: 'Créer avec les talents d’ici.',
  },
]

const currentYear = new Date().getFullYear()
const selectedTopic = ref('')
</script>

<template>
  <Navbar />
  <main>
    <Hero />

    <section id="filiales" class="branches section-shell" aria-labelledby="branches-title">
      <div class="section-heading">
        <div>
          <span class="eyebrow"><span class="eyebrow-dot"></span> Nos initiatives</span>
          <h2 id="branches-title">Trois univers.<br /><em>Un même engagement.</em></h2>
        </div>
        <p class="section-intro">
          <strong class="project-name project-name--maafrik">MAAFRIK CENTERS</strong>,
          <strong class="project-name project-name--saaki">SAAKI</strong> et
          <strong class="project-name project-name--gagnants">GAGNANTS 229</strong> gardent chacune
          leur mission et leur communauté. Fèfè Afriica les rassemble et vous oriente vers la bonne équipe.
        </p>
      </div>

      <div class="branches-grid">
        <FilialeCard
          v-for="filiale in filiales"
          :key="filiale.name"
          :filiale="filiale"
        />
      </div>
      <div class="branches-footnote">
        <span class="footnote-line"></span>
        <span>Une maison commune, trois communautés engagées.</span>
        <span class="footnote-line"></span>
      </div>
    </section>

    <EntryPoints @select-topic="selectedTopic = $event" />
    <Updates />
    <About />
    <Contact :selected-topic="selectedTopic" />
  </main>
  <Footer :year="currentYear" />
  <ChatBot />
</template>
