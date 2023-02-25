import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
<script src="https://kit.fontawesome.com/97726b2eee.js" crossorigin="anonymous"></script>

const ProfileButton = ({ sessionUser }) => {
    const dispatch = useDispatch();
    const { username, firstName, email, lastName } = sessionUser.user;
    const ulRef = useRef();
    const [showMenu, setShowMenu] = useState(false);

    const openMenu = () => {
        console.log(`openMenu`)
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            console.log(`closeMenu`);
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
    };



    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");


    return (
        <>
            <button onClick={openMenu}>
                <i className="fas fa-user-circle" />
            </button>
            <ul className={ulClassName} ref={ulRef}>
                <li className="navDropLi">{username}</li>
                <li className="navDropLi">{firstName} {lastName}</li>
                <li className="navDropLi">{email}</li>
                <li className="navDropLi">
                    <button className='logoutButton' onClick={logout}>Log Out</button>
                </li>
            </ul>
        </>

    )

}


// <div>
//     <button onClick={() => setShowMenu(!showMenu)} >
//         <i className="fa-sharp fa-solid fa-user"></i>
//     </button>
//     <ul className={ulClassName} >
//         <li className="navDropLi">{username}</li>
//         <li className="navDropLi">{firstName}</li>
//         <li className="navDropLi">{email}</li>
//         <li className="navDropLi">
//             <button className='logoutButton' onClick={logout}>Log Out</button>
//         </li>
//     </ul>
// </div>
export default ProfileButton
