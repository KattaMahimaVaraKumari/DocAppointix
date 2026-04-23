import doctorModel from '../models/doctorModel.js'
import axios from 'axios'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_MODEL = 'gemini-2.5-flash'

const FALLBACK_SPECIALITIES = [
  'General physician',
  'Gynecologist',
  'Dermatologist',
  'Pediatricians',
  'Neurologist',
  'Gastroenterologist',
]

const extractJson = (text = '') => {
  try {
    const cleaned = text.replace(/```json|```/gi, '').trim()
    const match = cleaned.match(/\{[\s\S]*\}/)
    return match ? match[0] : cleaned
  } catch (e) {
    return text
  }
}

const normalizeUrgency = (urgency = '') => {
  const value = String(urgency).trim().toLowerCase()
  if (value === 'red') return 'Red'
  if (value === 'yellow') return 'Yellow'
  return 'Green'
}

const matchSpeciality = (suggested = '', validSpecialities = []) => {
  if (!suggested) return 'General physician'
  const direct = validSpecialities.find((item) => item.toLowerCase() === suggested.toLowerCase())
  if (direct) return direct
  const fuzzy = validSpecialities.find(
    (item) =>
      item.toLowerCase().includes(suggested.toLowerCase()) ||
      suggested.toLowerCase().includes(item.toLowerCase())
  )
  return fuzzy || 'General physician'
}

const triage = async (req, res) => {
  try {
    const { symptoms = '', imageBase64 = '' } = req.body

    if (!symptoms && !imageBase64) {
      return res.json({ success: false, message: 'Provide symptoms text or image' })
    }

    if (!GEMINI_API_KEY) {
      return res.json({ success: false, message: 'Gemini API key is missing' })
    }

    const dbSpecialities = await doctorModel.distinct('speciality')
    const validSpecialities = dbSpecialities.length ? dbSpecialities : FALLBACK_SPECIALITIES

    const systemPrompt = `
      You are a medical triage assistant. Return a valid JSON object only.
      Structure:
      {
        "diagnosis": "string",
        "home_care": "string",
        "specialty": "string",
        "urgency": "Red" | "Yellow" | "Green",
        "explanation": "string"
      }
      Constraints:
      - specialty MUST be one of: ${validSpecialities.join(', ')}.
    `

    const parts = [{ text: `${systemPrompt}\n\nUser Symptoms: ${symptoms}` }]

    if (imageBase64) {
      const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64
      parts.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: base64Data
        }
      })
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ role: 'user', parts }]
      }
    )

    const result = response.data

    const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text || ''

    let parsed
    try {
      parsed = JSON.parse(extractJson(rawText))
    } catch (parseError) {
      return res.json({ success: false, message: 'AI returned malformed data. Try again.' })
    }

    res.json({
      success: true,
      triage: {
        diagnosis: parsed.diagnosis || 'Analysis completed',
        home_care: parsed.home_care || 'Monitor symptoms.',
        specialty: matchSpeciality(parsed.specialty, validSpecialities),
        urgency: normalizeUrgency(parsed.urgency),
        explanation: parsed.explanation || 'Based on input.',
      }
    })

  } catch (error) {
    console.error("Internal Server Error:", error)
    res.json({ success: false, message: 'Internal Server Error' })
  }
}

export { triage }