import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './EventsGroupsNav.css'

function EventsGroupsNav() {

    return (
        <ul className='EventsGroupsNav'>
            <li>
                <NavLink className={`loginSignup`} to='/events'>Events</NavLink>
                <NavLink className={`loginSignup`} to='/groups'>Groups</NavLink>
            </li>
        </ul>
    )
}


export default EventsGroupsNav;
