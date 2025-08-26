import React from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import './styles.css'

function useHideTabs(){
  const { pathname } = useLocation()
  return pathname.startsWith('/app/e/')
}

export default function AppShell(){
  const hideTabs = useHideTabs()
  return (
    <div id="app">
      <div className="header"><strong>So Also</strong></div>
      <main><Outlet/></main>
      {!hideTabs && <Tabs/>}
      <div style={{paddingBottom:'env(safe-area-inset-bottom)'}}/>
    </div>
  )
}

function Tabs(){
  const tabs = [
    { to:'/app/map', label:'Map', icon:'🗺️' },
    { to:'/app/list', label:'List', icon:'📋' },
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
