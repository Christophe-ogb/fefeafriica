import { GoogleGenAI } from '@google/genai'
import { config as loadEnv } from 'dotenv'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const localEnvPath = resolve(process.cwd(), '.env.local')
if (existsSync(localEnvPath)) loadEnv({ path: localEnvPath })

const SYSTEM_INSTRUCTION = `Tu es Fèfè Bot, l'assistant virtuel officiel de la fédération Fèfè Afriica (FEFE AFRICA), basée à Calavi, au Bénin. Aide les visiteurs sur la fédération, ses filiales, leurs activités et les informations publiées sur le portail. Réponds en français avec courtoisie et précision.

INFORMATIONS OFFICIELLES DU PORTAIL
Fèfè Afriica est la maison commune de trois initiatives béninoises complémentaires : MAAFRIK CENTERS forme et accompagne les talents, SAAKI agit pour des emballages plus durables et GAGNANTS 229 valorise le patrimoine béninois par le jeu.

SAAKI
- Site : https://saaki.bj
- Écologie et environnement ; fabrication au Bénin et distribution de sacs en papier pour proposer une alternative aux sacs plastiques et réduire le péril plastique.
- Le portail annonce son lancement officiel le mardi 3 novembre 2026. Informations et réservation de pass : https://eventreet.com/event/saaki-green-launch/395

GAGNANTS 229 (aussi écrit Gagnants229)
- Site : https://gagnants229.com
- Culture, divertissement et patrimoine béninois, transmis par des jeux, quiz, animations et rendez-vous culturels.

MAAFRIK CENTERS
- Page officielle : https://www.facebook.com/maafrik
- Formation, compétences numériques, design, conception graphique, impression, marquage publicitaire, emballages et entrepreneuriat.
- Accompagne les jeunes vers le développement de compétences et l'insertion professionnelle.

CONTACT ET LOCALISATION
- Le portail situe la fédération à Calavi, au Bénin. Coordonnées indicatives publiées : 06° 22' N, 02° 25' E. Le portail ne fournit pas d'adresse de rue.
- Formulaire de contact : section « Contact » du portail (#contact).
- WhatsApp de l'équipe : https://wa.me/2290141757539

RÈGLES DE RÉPONSE
- Réponds aux questions pertinentes, y compris si elles contiennent des fautes de frappe, des accents manquants ou une formulation familière. Déduis l'intention sans corriger l'utilisateur de façon condescendante.
- Utilise les informations officielles ci-dessus pour répondre directement. Pour une information qui n'y figure pas (par exemple le nom du dirigeant, les dates de création des filiales, une adresse de rue ou les horaires), indique honnêtement qu'elle n'est pas publiée dans les informations dont tu disposes et propose le formulaire ou WhatsApp.
- Pour une question sur des informations récentes ou absentes de ce contexte, recherche des informations fiables sur le Web lorsque cela peut aider. Distingue les faits publiés par FEFE AFRICA des informations trouvées ailleurs et ne présente pas une source externe comme une information officielle.
- N'invente jamais de faits. Pour une commande, un devis ou un partenariat, oriente vers le formulaire ou WhatsApp.`

const MAX_MESSAGE_LENGTH = 1200
const MAX_HISTORY_MESSAGES = 20

function getContents(body) {
  const messages = Array.isArray(body.messages)
    ? body.messages
    : [
        ...(Array.isArray(body.history) ? body.history : []),
        ...(typeof body.message === 'string' ? [{ role: 'user', content: body.message }] : []),
      ]

  if (messages.length === 0 || messages.length > 100) return null

  const contents = []
  for (const message of messages.slice(-MAX_HISTORY_MESSAGES)) {
    if (
      typeof message !== 'object' ||
      message === null ||
      !['user', 'assistant'].includes(message.role) ||
      typeof message.content !== 'string' ||
      message.content.trim().length === 0 ||
      message.content.length > MAX_MESSAGE_LENGTH
    ) {
      return null
    }

    contents.push({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content.trim() }],
    })
  }

  while (contents[0]?.role === 'model') contents.shift()
  return contents.length > 0 && contents[contents.length - 1].role === 'user' ? contents : null
}

async function handleChat(body) {
  try {
    if (typeof body !== 'object' || body === null) {
      return Response.json(
        { error: 'Le corps de la requête doit être un objet JSON.' },
        { status: 400 },
      )
    }

    const contents = getContents(body)
    if (!contents) {
      return Response.json(
        { error: 'Le message ou l’historique fourni est invalide.' },
        { status: 400 },
      )
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not configured.')
      return Response.json(
        { error: 'Le service de discussion est momentanément indisponible.' },
        { status: 500 },
      )
    }

    const ai = new GoogleGenAI({ apiKey })
    const result = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      },
    })

    if (typeof result.text !== 'string' || result.text.trim().length === 0) {
      throw new Error('Gemini returned an empty response.')
    }

    const sources = (result.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [])
      .flatMap((chunk) => {
        const uri = chunk.web?.uri
        if (!uri) return []

        try {
          const parsedUri = new URL(uri)
          if (parsedUri.protocol !== 'https:' && parsedUri.protocol !== 'http:') return []
          return [{ title: chunk.web?.title || parsedUri.hostname, url: parsedUri.href }]
        } catch {
          return []
        }
      })
      .filter((source, index, allSources) =>
        allSources.findIndex((candidate) => candidate.url === source.url) === index,
      )

    return Response.json({ reply: result.text.trim(), sources })
  } catch (error) {
    console.error('Gemini chat request failed.', error)
    const status =
      typeof error === 'object' && error !== null && 'status' in error
        ? error.status
        : undefined

    if (
      status === 404
    ) {
      return Response.json(
        {
          error:
            'Le modèle Gemini configuré n’est pas disponible pour ce projet. Vérifiez le modèle et les accès de l’API.',
        },
        { status: 502 },
      )
    }

    if (status === 503 || status === 504) {
      return Response.json(
        { error: 'Gemini est temporairement indisponible. Réessayez dans quelques instants.' },
        { status: 503 },
      )
    }

    if (status === 429) {
      return Response.json(
        { error: 'La limite est atteinte. Réessayez plus tard.' },
        { status: 429 },
      )
    }

    if (status === 401 || status === 403) {
      return Response.json(
        { error: 'Gemini a refusé la clé API ou son accès. Vérifiez la clé et les autorisations du projet.' },
        { status: 502 },
      )
    }

    return Response.json(
      { error: 'Une erreur est survenue lors de la génération de la réponse. Veuillez réessayer.' },
      { status: 500 },
    )
  }
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Méthode non autorisée.' })
  }

  let body
  try {
    body = request.body
  } catch {
    return response
      .status(400)
      .json({ error: 'Le corps de la requête doit être un objet JSON valide.' })
  }

  if (typeof body === 'string' || Buffer.isBuffer(body)) {
    try {
      body = JSON.parse(body.toString())
    } catch {
      return response
        .status(400)
        .json({ error: 'Le corps de la requête doit être un objet JSON valide.' })
    }
  }

  const result = await handleChat(body)
  return response.status(result.status).json(await result.json())
}
