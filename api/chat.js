import { GoogleGenAI } from '@google/genai'
import { config as loadEnv } from 'dotenv'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const localEnvPath = resolve(process.cwd(), '.env.local')
if (existsSync(localEnvPath)) loadEnv({ path: localEnvPath })

const SYSTEM_INSTRUCTION = `Tu es Fèfè Bot, l'assistant virtuel officiel de la fédération Fèfè Afriica (FEFE AFRICA), basée à Calavi, au Bénin. Réponds avec courtoisie, clarté et concision à toutes les questions concernant la fédération, son siège, ses activités, ses filiales et les moyens de contact.
1. SAAKI (saaki.bj) : Écologie, fabrication et distribution de sacs en papier pour éradiquer les sacs plastiques au Bénin.
2. Gagnants229 (gagnants229.com) : Culture & Divertissement, valorisation du patrimoine béninois par des jeux et animations.
3. MAAFRIK CENTERS : Conception graphique, impression tout support, marquage publicitaire, emballages et formation des jeunes pour l'insertion professionnelle.
La fédération est basée à Calavi, au Bénin. N'invente pas une adresse précise, le nom du dirigeant, des horaires ou toute autre information qui ne figure pas dans ce contexte. Si une information demandée n'est pas connue, dis-le clairement et propose de contacter l'équipe via le formulaire du site ou WhatsApp.
Comprends les fautes de frappe, les accents manquants, les formulations familières et les messages courts. Ne refuse pas une question simplement parce qu'elle est mal orthographiée.
Pour une commande, un devis ou un partenariat, invite poliment l'utilisateur à contacter l'équipe via le formulaire du site ou WhatsApp.`

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
      config: { systemInstruction: SYSTEM_INSTRUCTION },
    })

    if (typeof result.text !== 'string' || result.text.trim().length === 0) {
      throw new Error('Gemini returned an empty response.')
    }

    return Response.json({ reply: result.text.trim() })
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
        { error: 'La limite de requêtes Gemini est atteinte. Réessayez dans quelques instants.' },
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
