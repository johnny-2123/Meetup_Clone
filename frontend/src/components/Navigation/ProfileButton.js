import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import * as sessionActions from '../../store/session';
<script src="https://kit.fontawesome.com/97726b2eee.js" crossorigin="anonymous"></script>

const ProfileButton = ({ sessionUser }) => {

    const history = useHistory();
    const dispatch = useDispatch();
    const { username, firstName, email, lastName } = sessionUser;
    const ulRef = useRef();
    const [showMenu, setShowMenu] = useState(false);

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false)
            }

        }

        document.addEventListener('click', closeMenu);
        return () => document.removeEventListener('click', closeMenu);
    }, [showMenu])

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.fetchLogout());
        history.push('/')
    };

    const SeeMyGroups = (e) => {
        e.preventDefault();
        history.push(`/groups/current`)
    }


    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");


    return (
        <>
            <button className="profileButton" onClick={openMenu}>
                <i className="fas fa-user-circle profileIcon" />
            </button>
            <ul className={ulClassName} ref={ulRef}>
                <li className="navDropLi">{username}</li>
                <li className="navDropLi">{firstName} {lastName}</li>
                <li className="navDropLi">{email}</li>
                <li className="navDropLi">
                    <button className='logoutButton' onClick={SeeMyGroups}> See My Groups</button>
                </li>
                <li className="navDropLi">
                    <button className='logoutButton' onClick={logout}>Log Out</button>
                </li>
            </ul>
        </>

    )

}

export default ProfileButton
