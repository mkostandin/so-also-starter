import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

export default function MapView(){
  return (
    <div className="container">
      <h2>Browse</h2>
      <div className="segmented">
        <NavLink to="/app/map" end className={({isActive}) => isActive ? 'seg active' : 'seg'}>Map</NavLink>
        <NavLink to="/app/map/list" className={({isActive}) => isActive ? 'seg active' : 'seg'}>List</NavLink>
        <NavLink to="/app/map/calendar" className={({isActive}) => isActive ? 'seg active' : 'seg'}>Calendar</NavLink>
      </div>
      <div style={{marginTop:12}}>
        <Outlet/>
      </div>
    </div>
  )
}
