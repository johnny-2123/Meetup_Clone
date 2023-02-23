import React, { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router';
import './SignUpForm.css';

const SignUpPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionUser = useSelector(state => state.session.user);

    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [passwordsMatch, setPasswordsMatch] = useState(false);

    useEffect(() => {
        if (confirmPassword !== password) {
            setPasswordsMatch(true)
            setErrors(['passwords do not match'])
        } else {
            setPasswordsMatch(false)
        }
    }, [confirmPassword, password])

    // useEffect(() => {
    //     if (sessionUser) {
    //         history.push('/')
    //     }
    // }, [sessionUser])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        const user = {
            username,
            firstName,
            lastName,
            email,
            password,
        }

        const response = await dispatch(sessionActions.fetchSignUp(user))
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
            {<ul>
                {errors.map((error, idx) => <li key={idx}>{error.message}</li>)}
            </ul>}
            <label>
                Username
                <input
                    type={`text`}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                >
                </input>
            </label>
            <label>
                firstName
                <input
                    type={`text`}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                >
                </input>
            </label>
            <label>
                lastName
                <input
                    type={`text`}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                >
                </input>
            </label>
            <label>
                email
                <input
                    type={`text`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                >
                </input>
            </label>
            <label>
                password
                <input
                    type={`text`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                >
                </input>
            </label>
            <label>
                confirm password
                <input
                    type={`text`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                >
                </input>
            </label>
            <button disabled={passwordsMatch} type='submit' >Log In</button>
        </form>
    )

};


export default SignUpPage;
