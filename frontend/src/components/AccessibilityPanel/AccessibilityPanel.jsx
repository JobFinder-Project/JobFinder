import { useEffect, useRef, useState } from 'react'
import { BiAccessibility, BiVolumeFull } from 'react-icons/bi'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import styles from './AccessibilityPanel.module.css'

const focusable = 'button:not([disabled]), select:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
const readable = 'h1, h2, h3, h4, h5, h6, p, li, a, button, label, td, th, blockquote, [role="button"]'
const speechErrors = {
  'audio-busy': 'O dispositivo de áudio está ocupado. Verifique a saída de som do sistema.',
  'audio-hardware': 'Nenhuma saída de áudio foi encontrada pelo navegador.',
  'language-unavailable': 'Não há voz disponível para português neste navegador.',
  'not-allowed': 'O navegador bloqueou a reprodução. Clique em Testar voz para liberar o áudio.',
  'synthesis-unavailable': 'Este navegador não tem um mecanismo de leitura em voz alta.',
  'voice-unavailable': 'A voz escolhida não está disponível neste navegador.',
}

function readableTarget(element, application) {
  if (!(element instanceof Element) || !application.contains(element)) return null
  const target = element.closest(readable) || element.closest('span')
  return target && application.contains(target) ? target : null
}

export default function AccessibilityPanel() {
  const { preferences, setPreference, resetAll } = useAccessibility()
  const [open, setOpen] = useState(false)
  const [speechStatus, setSpeechStatus] = useState('')
  const [speechError, setSpeechError] = useState('')
  const [voices, setVoices] = useState([])
  const triggerRef = useRef(null)
  const panelRef = useRef(null)
  const selectedTextRef = useRef('')
  const hoverTimerRef = useRef(null)
  const activeSpeechRef = useRef(null)
  const supportsSpeech = typeof window !== 'undefined' && 'speechSynthesis' in window

  const stopReading = () => {
    clearTimeout(hoverTimerRef.current)
    hoverTimerRef.current = null
    activeSpeechRef.current = null
    if (supportsSpeech) window.speechSynthesis.cancel()
  }

  const speakText = (text) => {
    if (!supportsSpeech || !text) return
    stopReading()
    setSpeechError('')
    const utterance = new SpeechSynthesisUtterance(text)
    const availableVoices = window.speechSynthesis.getVoices?.() || []
    const voice = availableVoices.find(item => item.voiceURI === preferences.speechVoice)
      || availableVoices.find(item => item.lang.toLowerCase() === 'pt-br')
      || availableVoices.find(item => item.lang.toLowerCase().startsWith('pt'))
      || availableVoices.find(item => item.default)
    if (voice) utterance.voice = voice
    utterance.lang = voice?.lang || 'pt-BR'
    utterance.volume = 1
    utterance.onstart = () => {
      if (activeSpeechRef.current === utterance) setSpeechStatus(`Lendo em voz alta${voice ? ` com ${voice.name}` : ''}.`)
    }
    utterance.onend = () => {
      if (activeSpeechRef.current === utterance) setSpeechStatus(`Leitura concluída${voice ? ` com ${voice.name}` : ''}.`)
    }
    utterance.onerror = event => {
      if (activeSpeechRef.current !== utterance || ['canceled', 'interrupted'].includes(event.error)) return
      const message = speechErrors[event.error] || `Não foi possível reproduzir a voz (${event.error || 'erro desconhecido'}).`
      setSpeechError(message)
      setSpeechStatus(message)
    }
    activeSpeechRef.current = utterance
    setSpeechStatus('Iniciando leitura em voz alta...')
    window.speechSynthesis.speak(utterance)
  }

  useEffect(() => {
    if (!supportsSpeech) return undefined
    const synth = window.speechSynthesis
    const updateVoices = () => setVoices(synth.getVoices?.() || [])
    updateVoices()
    synth.addEventListener?.('voiceschanged', updateVoices)
    return () => synth.removeEventListener?.('voiceschanged', updateVoices)
  }, [supportsSpeech])

  useEffect(() => {
    if (!open) return undefined
    const panel = panelRef.current
    const application = document.getElementById('application-content')
    const skipLink = document.querySelector('.skip-link')
    application?.setAttribute('inert', '')
    skipLink?.setAttribute('inert', '')
    const focusFrame = requestAnimationFrame(() => panel?.querySelector(focusable)?.focus())
    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
      }
      if (event.key !== 'Tab' || !panel) return
      const elements = [...panel.querySelectorAll(focusable)]
      if (!elements.length) return
      const first = elements[0]
      const last = elements[elements.length - 1]
      if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      cancelAnimationFrame(focusFrame)
      application?.removeAttribute('inert')
      skipLink?.removeAttribute('inert')
    }
  }, [open])

  useEffect(() => {
    if (!supportsSpeech) return undefined
    const application = document.getElementById('application-content')
    if (!preferences.hoverReading || open || !application) {
      stopReading()
      return undefined
    }

    let currentTarget = null
    const onMouseOver = event => {
      const target = readableTarget(event.target, application)
      if (!target || target === currentTarget) return
      const text = (target.innerText || target.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 600)
      if (!text) return
      clearTimeout(hoverTimerRef.current)
      currentTarget = target
      hoverTimerRef.current = window.setTimeout(() => {
        speakText(text)
      }, 200)
    }
    const onMouseOut = event => {
      if (!currentTarget || !currentTarget.contains(event.target)) return
      if (event.relatedTarget && currentTarget.contains(event.relatedTarget)) return
      clearTimeout(hoverTimerRef.current)
      currentTarget = null
    }
    application.addEventListener('mouseover', onMouseOver)
    application.addEventListener('mouseout', onMouseOut)
    return () => {
      application.removeEventListener('mouseover', onMouseOver)
      application.removeEventListener('mouseout', onMouseOut)
      stopReading()
    }
  }, [preferences.hoverReading, open, supportsSpeech])

  useEffect(() => () => {
    clearTimeout(hoverTimerRef.current)
    if (supportsSpeech) window.speechSynthesis.cancel()
  }, [supportsSpeech])

  const close = () => {
    setOpen(false)
    triggerRef.current?.focus()
  }

  const speakSelection = () => {
    const selected = window.getSelection()?.toString().trim() || selectedTextRef.current
    if (!selected) {
      setSpeechStatus('Selecione um trecho de texto na página antes de iniciar a leitura.')
      return
    }
    speakText(selected)
  }

  const toggle = (key, label) => (
    <label className={styles.toggleRow} key={key}>
      <span>{label}</span>
      <input type="checkbox" checked={preferences[key]} onChange={event => setPreference(key, event.target.checked)} />
    </label>
  )

  return (
    <div className={styles.anchor}>
      <section ref={panelRef} id="accessibility-panel" className={styles.panel} data-open={open} inert={!open} aria-hidden={!open} role="dialog" aria-modal="true" aria-labelledby="a11y-title">
          <header className={styles.header}>
            <h2 id="a11y-title">Acessibilidade</h2>
            <button type="button" className={styles.close} onClick={close} aria-label="Fechar painel de acessibilidade">×</button>
          </header>
          <div className={styles.content}>
            {supportsSpeech && (
              <div className={styles.speech}>
                <h3>Leitura em voz alta</h3>
                <label className={styles.toggleRow}>
                  <span>Ler ao passar o mouse</span>
                  <input type="checkbox" checked={preferences.hoverReading} aria-describedby="a11y-hover-help" onChange={event => setPreference('hoverReading', event.target.checked)} />
                </label>
                <p id="a11y-hover-help">Ative, feche o painel e passe o cursor sobre um texto. A frase continua mesmo após mover o cursor.</p>
                <p>Também é possível selecionar um trecho e usar o botão abaixo.</p>
                <label className={styles.selectRow} htmlFor="a11y-voice">Voz</label>
                <select id="a11y-voice" value={voices.some(voice => voice.voiceURI === preferences.speechVoice) ? preferences.speechVoice : ''} onChange={event => setPreference('speechVoice', event.target.value)}>
                  <option value="">Automática (priorizar português)</option>
                  {voices.map(voice => <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name} ({voice.lang})</option>)}
                </select>
                {voices.length === 0 && <p>Nenhuma voz foi listada por este navegador.</p>}
                {voices.length > 0 && !voices.some(voice => voice.lang.toLowerCase().startsWith('pt')) && <p>Nenhuma voz em português foi encontrada. Escolha uma voz acima ou instale uma voz em português no sistema.</p>}
                <div className={styles.speechButtons}>
                  <button type="button" onClick={() => speakText('Olá! A leitura em voz alta está funcionando.')}>Testar voz</button>
                  <button type="button" onClick={speakSelection}>Ler seleção</button>
                  <button type="button" onClick={() => { stopReading(); setSpeechStatus('Leitura interrompida.') }}>Parar</button>
                </div>
                <p role="status">{speechStatus}</p>
              </div>
            )}
            <fieldset className={styles.group}>
              <legend>Tamanho do texto</legend>
              <div className={styles.sizeButtons}>
                {[['small', 'A−'], ['normal', 'A'], ['large', 'A+'], ['extraLarge', 'A++']].map(([value, label]) => (
                  <button type="button" key={value} aria-label={`Tamanho do texto: ${value === 'small' ? 'menor' : value === 'normal' ? 'normal' : value === 'large' ? 'grande' : 'extra grande'}`} aria-pressed={preferences.textSize === value} onClick={() => setPreference('textSize', value)}>{label}</button>
                ))}
              </div>
            </fieldset>
            {toggle('highContrast', 'Alto contraste')}
            <label className={styles.selectRow} htmlFor="a11y-color-mode">Modo daltônico</label>
            <select id="a11y-color-mode" value={preferences.colorMode} onChange={event => setPreference('colorMode', event.target.value)}>
              <option value="normal">Normal</option>
              <option value="deuteranopia">Deuteranopia</option>
              <option value="protanopia">Protanopia</option>
              <option value="tritanopia">Tritanopia</option>
            </select>
            {toggle('textSpacing', 'Espaçamento de texto')}
            {toggle('dyslexiaFont', 'Fonte para dislexia')}
            {toggle('reducedMotion', 'Animações reduzidas')}
            {toggle('enhancedFocus', 'Destaque de foco ampliado')}
            {toggle('largeCursor', 'Cursor grande')}
            <button type="button" className={styles.reset} onClick={resetAll}>Resetar tudo</button>
          </div>
      </section>
      <button ref={triggerRef} type="button" className={styles.trigger} aria-label={open ? 'Fechar painel de acessibilidade' : 'Abrir painel de acessibilidade'} aria-expanded={open} aria-controls="accessibility-panel" onPointerDown={() => { selectedTextRef.current = window.getSelection()?.toString().trim() || '' }} onClick={() => open ? close() : setOpen(true)}>
        <BiAccessibility aria-hidden="true" size={30} />
        {preferences.hoverReading && <BiVolumeFull className={styles.readingBadge} aria-hidden="true" size={15} />}
      </button>
      {!open && speechError && <p className={styles.speechError} role="alert">{speechError}</p>}
    </div>
  )
}
