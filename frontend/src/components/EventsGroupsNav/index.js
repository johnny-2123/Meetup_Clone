import React from 'react';
import { NavLink } from 'react-router-dom';
import './EventsGroupsNav.css'

function EventsGroupsNav() {

    return (
        <ul className='EventsGroupsNav'>
            <li>
                <NavLink className={`EventsGroupsLinks`} to='/events'>Events</NavLink>
                <NavLink className={`EventsGroupsLinks`} to='/groups'>Groups</NavLink>
            </li>
        </ul>
    )
}


export default EventsGroupsNav;
