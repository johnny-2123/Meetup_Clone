import React, { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router';
import './LoginForm.css';

const LoginFormPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionUser = useSelector(state => state.session.user);
    console.log(`session user:`)
    console.log(sessionUser);
    const [credential, setCredential] = useState('')
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        if (sessionUser && sessionUser.username === null) {
            history.push('/')
        }
    }, [sessionUser])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        const response = await dispatch(sessionActions.fetchLogin(credential, password))
        console.log(`component response`)
        console.log(response)
        if (response.username) {
            return response
        } else {
            setErrors([response]);
            return errors
        }
    }

    return (
        <div className='loginComponent'>
            <form className='loginForm' onSubmit={handleSubmit}>
                <ul>
                    {errors.map((error, idx) => <li key={idx}>{error.message}</li>)}
                </ul>
                <div className='formBox'>
                    <label for='credentials' className='label'>
                        Username or Email
                    </label>
                    <input
                        name='credentials'
                        className='input'
                        type={`text`}
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                    >
                    </input>
                </div>
                <div className='formBox'>
                    <label for='password' className='label'>
                        Password

                    </label>
                    <input
                        name='password'
                        className='input'
                        type={`text`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    >
                    </input>
                </div>
                <button type='submit' className='submitButton' >Log In</button>
            </form>
        </div>
    )

};


export default LoginFormPage;
