import { useRegisterSW } from 'virtual:pwa-register/react'
import { useEffect, useState } from 'react'

export default function PWAUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false)

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  useEffect(() => {
    if (needRefresh) setShowPrompt(true)
  }, [needRefresh])

  if (!showPrompt) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        background: 'linear-gradient(135deg, #f66713, #e55a0a)',
        color: 'white',
        borderRadius: '16px',
        padding: '16px 20px',
        boxShadow: '0 8px 32px rgba(246, 103, 19, 0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        minWidth: '300px',
        maxWidth: 'calc(100vw - 48px)',
        fontSize: '14px',
        fontFamily: 'inherit',
      }}
    >
      <img src="/stms logo circle.svg" alt="SIT" style={{ width: 36, height: 36, borderRadius: 8 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, marginBottom: 2 }}>Update Available</div>
        <div style={{ opacity: 0.9, fontSize: 12 }}>New version of SIT is ready</div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => { setNeedRefresh(false); setShowPrompt(false) }}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: 8,
            color: 'white',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          Later
        </button>
        <button
          onClick={() => updateServiceWorker(true)}
          style={{
            background: 'white',
            border: 'none',
            borderRadius: 8,
            color: '#f66713',
            padding: '6px 12px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          Update
        </button>
      </div>
    </div>
  )
}
