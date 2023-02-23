import React, { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router';
import './LoginForm.css';

const LoginFormPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionUser = useSelector(state => state.session.user);

    const [credential, setCredential] = useState('')
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        if (sessionUser) {
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
        <form onSubmit={handleSubmit}>
            <ul>
                {errors.map((error, idx) => <li key={idx}>{error.message}</li>)}
            </ul>
            <label>
                Username or Email
                <input
                    type={`text`}
                    value={credential}
                    onChange={(e) => setCredential(e.target.value)}
                    required
                >
                </input>
            </label>
            <label>
                Password
                <input
                    type={`text`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                >
                </input>
            </label>
            <button type='submit' >Log In</button>
        </form>
    )

};


export default LoginFormPage;
