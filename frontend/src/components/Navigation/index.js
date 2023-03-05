import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import * as sessionActions from '../../store/session';
import * as groupActions from '../../store/groups'
import { Redirect, useHistory } from 'react-router';
import OpenModalButton from '../OpenModalButton';

import { useModal } from '../../context/Modal';
function Navigation({ isLoaded }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionUser = useSelector(state => state.session.user?.user);
    const currentUserGroups = useSelector(state => state.groups.currentUserGroups)
    let sessionLinks;

    const { setShowLogin, setShowSignUp } = useModal()

    const loginButton = () => {
        setShowLogin(true)
    }
    const signUpButton = () => {
        setShowSignUp(true)
    }

    const handleDemoLoginClick = () => {
        return dispatch(sessionActions.fetchLogin({ credential: 'Demo-lition', password: 'password' }))
            .then(() => history.push('/'))
            .then(() => window.location.reload());

    }

    console.log(`sessionuser.user`, sessionUser)
    if (sessionUser && sessionUser !== undefined) {
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
                    <button
                        onClick={handleDemoLoginClick}
                        className={`loginSignup`} >Demo Login</button>
                    <button className={`loginSignup`} onClick={loginButton}> Login</button>
                    <button className={`loginSignup`} onClick={signUpButton}> Sign Up</button>
                </li>
            </ul >
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
