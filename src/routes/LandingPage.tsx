import React from 'react'
import { Link } from 'react-router-dom'
import { isStandalone } from '../lib/pwa'

function LandingPage() {
  const isPWA = isStandalone()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0b1220',
      color: '#e6edf8',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      {/* Hero Section */}
      <div style={{ maxWidth: '600px', marginBottom: '3rem' }}>
        {/* App Icon */}
        <div style={{ marginBottom: '2rem' }}>
          <img
            src="/app/icon-192.png"
            alt="So Also Icon"
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '20px',
              boxShadow: '0 8px 24px rgba(14, 165, 233, 0.3)'
            }}
          />
        </div>

        {/* App Title */}
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #0ea5e9, #22d3ee)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          So Also
        </h1>

        {/* Tagline */}
        <p style={{
          fontSize: '1.25rem',
          color: '#d1d5db',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Discover and share events and conferences happening around you
        </p>

        {/* Description */}
        <div style={{
          background: '#101826',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            marginBottom: '1rem',
            color: '#e6edf8'
          }}>
            🗺️ Explore Events • ➕ Share Your Own • 🏛️ Find Conferences
          </h2>
          <p style={{
            color: '#9ca3af',
            lineHeight: '1.6'
          }}>
            Browse local events on an interactive map, submit your own events,
            and discover upcoming conferences. Everything you need to stay
            connected with your community.
          </p>
        </div>

        {/* CTA Button */}
        <Link
          to="/app"
          style={{
            display: 'inline-block',
            background: '#0ea5e9',
            color: 'white',
            textDecoration: 'none',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '1.125rem',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#0284c7'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(14, 165, 233, 0.4)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#0ea5e9'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(14, 165, 233, 0.3)'
          }}
        >
          {isPWA ? 'Open App' : 'Get Started'}
        </Link>

        {/* PWA Install Hint */}
        {!isPWA && (
          <p style={{
            marginTop: '2rem',
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            💡 Install as an app for the best experience
          </p>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        padding: '2rem 0',
        fontSize: '0.875rem',
        color: '#6b7280',
        textAlign: 'center'
      }}>
        <p>© 2024 So Also. Built for event discovery.</p>
      </footer>
    </div>
  )
}

export default LandingPage
