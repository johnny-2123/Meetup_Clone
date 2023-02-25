import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import * as sessionActions from '../../store/session';
import './Navigation.css';
import { Redirect, useHistory } from 'react-router';


function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const history = useHistory();

    let sessionLinks;

    useEffect(() => {
        console.log(`loggin in user`)
    }, [sessionUser])

    if (sessionUser && sessionUser.user !== undefined) {
        sessionLinks = (
            <ul className='profileButtonUl'>
                <li>
                    <ProfileButton className={`profileButtonComponent`} sessionUser={sessionUser} />

                </li>
            </ul>
        )
    } else {
        sessionLinks = (
            <ul className='sessionLinksUl'>
                <li>
                    <NavLink className={`loginSignup`} to='/login'>Log In</NavLink>
                    <NavLink className={`loginSignup`} to='/signup'>Sign Up</NavLink>
                </li>
            </ul>
        )
    }

    return (
        <div className='mainavDiv'>
            <ul className='navUl'>
                <li className='homeButtonLi'>
                    <NavLink className='homeButton' exact to={`/`}>Meetup</NavLink>
                </li >
                <li className='navLi'>
                    {isLoaded && sessionLinks}
                </li>
            </ul>
        </div>
    )


}

export default Navigation
