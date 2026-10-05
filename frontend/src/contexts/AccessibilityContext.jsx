import { createContext, useContext, useEffect, useState } from 'react'

export const ACCESSIBILITY_STORAGE_KEY = 'jobfinder-accessibility'

export const defaultPreferences = Object.freeze({
  textSize: 'normal',
  highContrast: false,
  colorMode: 'normal',
  textSpacing: false,
  dyslexiaFont: false,
  reducedMotion: false,
  enhancedFocus: false,
  largeCursor: false,
  hoverReading: false,
  speechVoice: '',
})

const validTextSizes = ['small', 'normal', 'large', 'extraLarge']
const validColorModes = ['normal', 'deuteranopia', 'protanopia', 'tritanopia']
const fontSizes = { small: '14px', normal: '16px', large: '18px', extraLarge: '21px' }
const AccessibilityContext = createContext(null)

function readPreferences() {
  try {
    const saved = JSON.parse(localStorage.getItem(ACCESSIBILITY_STORAGE_KEY) || 'null')
    if (!saved || typeof saved !== 'object') return { ...defaultPreferences }
    return {
      textSize: validTextSizes.includes(saved.textSize) ? saved.textSize : 'normal',
      highContrast: saved.highContrast === true,
      colorMode: validColorModes.includes(saved.colorMode) ? saved.colorMode : 'normal',
      textSpacing: saved.textSpacing === true,
      dyslexiaFont: saved.dyslexiaFont === true,
      reducedMotion: saved.reducedMotion === true,
      enhancedFocus: saved.enhancedFocus === true,
      largeCursor: saved.largeCursor === true,
      hoverReading: saved.hoverReading === true,
      speechVoice: typeof saved.speechVoice === 'string' ? saved.speechVoice : '',
    }
  } catch {
    return { ...defaultPreferences }
  }
}

let fontPromise
function loadDyslexiaFont() {
  if (!('FontFace' in window)) return Promise.resolve()
  if (!fontPromise) {
    const face = new FontFace('OpenDyslexic', 'url(/fonts/OpenDyslexic-Regular.woff2)')
    fontPromise = face.load().then(loaded => { document.fonts.add(loaded) }).catch(() => { fontPromise = null })
  }
  return fontPromise
}

export function AccessibilityProvider({ children }) {
  const [preferences, setPreferences] = useState(readPreferences)

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--a11y-font-size', fontSizes[preferences.textSize])
    root.dataset.a11yContrast = String(preferences.highContrast)
    root.dataset.a11yColorMode = preferences.colorMode
    root.dataset.a11ySpacing = String(preferences.textSpacing)
    root.dataset.a11yDyslexiaFont = String(preferences.dyslexiaFont)
    root.dataset.a11yReducedMotion = String(preferences.reducedMotion)
    root.dataset.a11yFocus = String(preferences.enhancedFocus)
    root.dataset.a11yCursor = String(preferences.largeCursor)
    if (preferences.dyslexiaFont) loadDyslexiaFont()
    try {
      if (Object.keys(defaultPreferences).every(key => preferences[key] === defaultPreferences[key])) {
        localStorage.removeItem(ACCESSIBILITY_STORAGE_KEY)
      } else {
        localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(preferences))
      }
    } catch { /* Storage may be unavailable in private browsing. */ }
  }, [preferences])

  const setPreference = (key, value) => {
    if (!(key in defaultPreferences)) return
    setPreferences(current => ({ ...current, [key]: value }))
  }
  const resetAll = () => setPreferences({ ...defaultPreferences })

  return <AccessibilityContext.Provider value={{ preferences, setPreference, resetAll }}>{children}</AccessibilityContext.Provider>
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) throw new Error('useAccessibility requer AccessibilityProvider')
  return context
}
