import React, { useState, useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import './styles.css'
import {
  pwaInstallManager,
  isOnline,
  onConnectivityChange,
  onOrientationChange,
  isStandalone,
  onServiceWorkerUpdate,
  ensureCorrectPWAUrl
} from './lib/pwa'

function PWAErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('PWA Error:', event.error)
      setHasError(true)
      setError(event.error)
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('PWA Promise Rejection:', event.reason)
      setHasError(true)
      setError(new Error('Promise rejection: ' + event.reason))
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  if (hasError) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#0b1220',
        color: '#e6edf8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        zIndex: 10000
      }}>
        <h2>App Error</h2>
        <p>Something went wrong with the PWA features. The app will continue to work normally.</p>
        <button
          onClick={() => {
            setHasError(false)
            setError(null)
            window.location.reload()
          }}
          style={{
            background: '#0ea5e9',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '10px',
            marginTop: '1rem',
            cursor: 'pointer'
          }}
        >
          Reload App
        </button>
      </div>
    )
  }

  return <>{children}</>
}

function useHideTabs(){
  const { pathname } = useLocation()
  return pathname.startsWith('/app/e/')
}

function AppShell(){
  const hideTabs = useHideTabs()
  const [isOffline, setIsOffline] = useState(!isOnline())
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)
  const [isPortrait, setIsPortrait] = useState(true)

  useEffect(() => {
    // Ensure PWA opens at correct URL
    ensureCorrectPWAUrl()

    // Handle connectivity changes
    const unsubscribeConnectivity = onConnectivityChange((online) => {
      setIsOffline(!online)
    })

    // Handle orientation changes
    const unsubscribeOrientation = onOrientationChange((portrait) => {
      setIsPortrait(portrait)
    })

    // Handle PWA installation status
    const unsubscribeInstall = pwaInstallManager.onStatusChange((status) => {
      setShowInstallPrompt(status.isInstallable && !status.isInstalled && !isStandalone())
    })

    // Handle service worker updates
    const unsubscribeSW = onServiceWorkerUpdate(() => {
      setShowUpdatePrompt(true)
    })

    return () => {
      unsubscribeConnectivity()
      unsubscribeOrientation()
      unsubscribeInstall()
      unsubscribeSW()
    }
  }, [])

  const handleInstall = async () => {
    const success = await pwaInstallManager.install()
    if (success) {
      setShowInstallPrompt(false)
    }
  }

  const handleUpdate = () => {
    window.location.reload()
  }

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false)
  }

  const dismissUpdatePrompt = () => {
    setShowUpdatePrompt(false)
  }

  return (
    <div id="app">
      {/* Offline Indicator */}
      <div className={`offline-indicator ${isOffline ? 'show' : ''}`}>
        You're offline - Some features may not be available
      </div>

      {/* PWA Install Prompt */}
      {showInstallPrompt && (
        <div className="pwa-install-prompt">
          <div>
            <strong>Install So Also</strong>
            <p>Add to your home screen for the best experience!</p>
          </div>
          <div className="install-buttons">
            <button className="btn secondary" onClick={dismissInstallPrompt}>
              Later
            </button>
            <button className="btn" onClick={handleInstall}>
              Install
            </button>
          </div>
        </div>
      )}

      {/* Update Available Prompt */}
      {showUpdatePrompt && (
        <div className="pwa-update-available">
          <div>
            <strong>Update Available</strong>
            <p>A new version is ready to install.</p>
          </div>
          <div className="update-buttons">
            <button className="btn secondary" onClick={dismissUpdatePrompt}>
              Later
            </button>
            <button className="btn" onClick={handleUpdate}>
              Update Now
            </button>
          </div>
        </div>
      )}

      <div className="header safe-area-top">
        <strong>So Also</strong>
        {isOffline && <span style={{color: '#dc2626', fontSize: '12px', marginLeft: '8px'}}>Offline</span>}
      </div>

      <main className={isStandalone() ? 'standalone-main' : ''}>
        <Outlet/>
      </main>

      {!hideTabs && <Tabs/>}
      <div className="safe-area-bottom" style={{paddingBottom:'env(safe-area-inset-bottom)'}}/>
    </div>
  )
}

function Tabs(){
  const tabs = [
    { to:'/app/map', label:'Map', icon:'🗺️' },
    { to:'/app/submit', label:'Submit', icon:'➕' },
    { to:'/app/conferences', label:'Conferences', icon:'🏛️' },
    { to:'/app/settings', label:'Settings', icon:'⚙️' },
  ]
  return (
    <nav className="tabs">
      <ul>
        {tabs.map(t => (
          <li key={t.to}>
            <NavLink to={t.to} className={({isActive}) => isActive ? 'active' : ''}>
              <span style={{fontSize:20}} aria-hidden>{t.icon}</span>
              <span className="small">{t.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default function AppShellWithErrorBoundary() {
  return (
    <PWAErrorBoundary>
      <AppShell />
    </PWAErrorBoundary>
  )
}
