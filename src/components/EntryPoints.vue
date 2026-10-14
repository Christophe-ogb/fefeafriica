<script setup lang="ts">
import { ArrowUpRight, BookOpen, Handshake, Leaf, Sparkles } from '@lucide/vue'

const emit = defineEmits<{
  selectTopic: [topic: string]
}>()

const paths = [
  {
    number: '01',
    name: 'Se former',
    organization: 'MAAFRIK CENTERS',
    description: 'Jeune, étudiant ou professionnel : développez vos compétences et découvrez les formations.',
    topic: 'MAAFRIK CENTERS — Formation et insertion professionnelle',
    icon: BookOpen,
    kind: 'training',
  },
  {
    number: '02',
    name: 'Agir pour un Bénin vert',
    organization: 'SAAKI',
    description: 'Commerçant, fabricant ou partenaire : échangeons sur les sacs en papier et les campagnes.',
    topic: 'SAAKI — Commerçant, fabricant ou partenaire',
    icon: Leaf,
    kind: 'ecology',
  },
  {
    number: '03',
    name: 'Jouer & découvrir',
    organization: 'GAGNANTS 229',
    description: 'Joueur, parent, école ou passionné de culture : découvrez les jeux et animations.',
    topic: 'GAGNANTS 229 — Jeux et patrimoine',
    icon: Sparkles,
    kind: 'culture',
  },
  {
    number: '04',
    name: 'Devenir partenaire',
    organization: 'FÈFÈ AFRIICA',
    description: 'Vous souhaitez soutenir une initiative ou construire un projet ensemble ?',
    topic: 'Fèfè Afriica — Partenariat',
    icon: Handshake,
    kind: 'partner',
  },
]
</script>

<template>
  <section id="parcours" class="pathways section-shell" aria-labelledby="pathways-title">
    <div class="pathways-heading">
      <div>
        <span class="eyebrow"><span class="eyebrow-dot"></span> Une porte d’entrée pour chaque projet</span>
        <h2 id="pathways-title">Qu’est-ce qui vous<br /><em>amène chez nous ?</em></h2>
      </div>
      <p>Choisissez votre point de départ. Nous vous orienterons vers l’équipe concernée.</p>
    </div>

    <div class="pathways-grid">
      <article
        v-for="path in paths"
        :key="path.number"
        class="pathway-card"
        :class="`pathway-card--${path.kind}`"
      >
        <div class="pathway-topline">
          <span class="pathway-index">{{ path.number }}</span>
          <component :is="path.icon" :size="19" :stroke-width="1.7" aria-hidden="true" />
        </div>
        <span class="pathway-organization">{{ path.organization }}</span>
        <h3>{{ path.name }}</h3>
        <p>{{ path.description }}</p>
        <a
          class="pathway-action"
          href="#contact"
          @click="emit('selectTopic', path.topic)"
        >
          Nous contacter <ArrowUpRight :size="15" />
        </a>
      </article>
    </div>
  </section>
</template>
