import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './styles.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import AppShell from './AppShell'
import MapView from './routes/MapView'
import ListView from './routes/ListView'
import CalendarView from './routes/CalendarView'
import MapHome from './routes/MapHome'
import SubmitEvent from './routes/SubmitEvent'
import Settings from './routes/Settings'
import EventDetail from './routes/EventDetail'
import EmbedView from './routes/EmbedView'
import Conferences from './routes/Conferences'
import ConferenceDetail from './routes/ConferenceDetail'
import SeriesEditor from './routes/SeriesEditor'

const router = createBrowserRouter([
  { path: '/', element: <div/> },
  {
    path: '/app',
    element: <AppShell/>,
    children: [
      { index: true, element: <Navigate to="/app/map" replace/> },
      {
        path: 'map',
        element: <MapView/>,
        children: [
          { index: true, element: <MapHome/> },
          { path: 'list', element: <ListView/> },
          { path: 'calendar', element: <CalendarView/> }
        ]
      },
      { path: 'submit', element: <SubmitEvent/> },
      { path: 'settings', element: <Settings/> },
      { path: 'conferences', element: <Conferences/> },
      { path: 'conference/:id', element: <ConferenceDetail/> },
      { path: 'e/:slug', element: <EventDetail/> },
      { path: 'series/new', element: <SeriesEditor/> }  // can hide behind admin later
    ]
  },
  { path: '/embed', element: <EmbedView/> }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)
