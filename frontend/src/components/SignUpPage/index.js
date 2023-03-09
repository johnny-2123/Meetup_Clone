import React, { useEffect, useRef, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useModal } from "../../context/Modal";

import './SignUpForm.css';

const SignUpPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionUser = useSelector(state => state.session?.user);

    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const { setShowSignUp } = useModal();

    const ulRef = useRef();

    useEffect(() => {
        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowSignUp(false)
            }

        }

        document.addEventListener('click', closeMenu);
        return () => document.removeEventListener('click', closeMenu);
    }, [])


    useEffect(() => {
        if (confirmPassword !== password) {
            setErrors(['passwords do not match'])
            setPasswordsMatch(false)

        } else {
            setErrors([])
            setPasswordsMatch(true)
        }
    }, [confirmPassword, password])

    useEffect(() => {
        if (sessionUser && (sessionUser.username !== undefined || null)) {
            history.push('/')
            window.location.reload();
        }
    }, [sessionUser])


    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setErrors([]);
            return dispatch(sessionActions.fetchSignUp({ firstName, lastName, email, username, password }))
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                });
        }
        return setErrors(['Confirm Password field must be the same as the Password field']);
    };

    return (
        <>
            <div className='mainDiv'>
                <div className='loginComponent' ref={ulRef}>
                    <form className='loginForm' onSubmit={handleSubmit}>
                        {errors && <ul className='errors'>
                            {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                        </ul>}
                        <div className='formBox'>
                            <label for='username' className='label'>
                                Username
                            </label>
                            <input
                                className='input'
                                name='username'
                                type={`text`}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            >
                            </input>

                        </div>
                        <div className='formBox'>
                            <label for='firstName' className='label'>
                                firstName
                            </label>
                            <input
                                className='input'
                                name='firstName'
                                type={`text`}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            >
                            </input>

                        </div>
                        <div className='formBox'>
                            <label for='lastName' className='label'>
                                lastName
                            </label>
                            <input
                                className='input'
                                name='lastName'
                                type={`text`}
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            >
                            </input>

                        </div>
                        <div className='formBox'>
                            <label for='email' className='label'>
                                email
                            </label>
                            <input
                                className='input'
                                name='email'
                                type={`text`}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            >
                            </input>

                        </div>
                        <div className='formBox'>
                            <label for='password' className='label'>
                                password
                            </label>
                            <input
                                className='input'
                                name='password'
                                type={`password`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            >
                            </input>

                        </div>
                        <div className='formBox'>
                            <label for='confirmPassword' className='label'>
                                confirm password
                            </label>
                            <input
                                className='input'
                                name='confirmPassword'
                                type={`password`}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            >
                            </input>

                        </div>
                        <button disabled={!passwordsMatch} type='submit' className='submitButton'>Sign Up</button>
                    </form>
                </div>
            </div>
        </>
    )

};


export default SignUpPage;
