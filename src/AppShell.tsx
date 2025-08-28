import React, { useState, useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import './styles.css'
import {
  pwaInstallManager,
  isOnline,
  onConnectivityChange,
  onOrientationChange,
  isStandalone,
  onServiceWorkerUpdate
} from './lib/pwa'

function useHideTabs(){
  const { pathname } = useLocation()
  return pathname.startsWith('/app/e/')
}

export default function AppShell(){
  const hideTabs = useHideTabs()
  const [isOffline, setIsOffline] = useState(!isOnline())
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)
  const [isPortrait, setIsPortrait] = useState(true)

  useEffect(() => {
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
