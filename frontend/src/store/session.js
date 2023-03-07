import { csrfFetch } from "./csrf";

const SET_SESSION_USER = 'session/SET_SESSION_USER';
const REMOVE_SESSION_USER = 'session/REMOVE_SESSION_USER';

export const setSessionUser = (user) => {
    return {
        type: SET_SESSION_USER,
        user
    }
}

export const removeSessionUser = () => {
    return {
        type: REMOVE_SESSION_USER
    }
}

export const fetchSignUp = (user) => async dispatch => {
    const { username, firstName, lastName, email, password } = user;
    const response = await csrfFetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username,
            firstName,
            lastName,
            email,
            password,
        })
    })
    if (response.ok) {
        const data = await response.json();

        await dispatch(setSessionUser(data));
        return data;
    } else {
        return response.errors
    }
}

export const fetchLogin = ({ credential, password }) => async dispatch => {


    const response = await csrfFetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            credential,
            password
        })
    })

    if (response.ok) {
        const data = await response.json();

        await dispatch(setSessionUser(data));
        return data;
    } else {
        return response.errors
    }
}


export const fetchLogout = () => async dispatch => {
    const response = await csrfFetch('/api/session', {
        method: 'Delete',
    });

    dispatch(removeSessionUser());

    return response;
}

export const restoreUser = () => async dispatch => {
    const response = await csrfFetch('/api/session');

    const data = await response.json();
    console.log(`restoreUser data`, data)
    dispatch(setSessionUser(data));
    return data;
}

const initialState = {
    user: null
}

const sessionReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case SET_SESSION_USER:
            newState = Object.assign({}, state)
            newState.user = action.user;
            return newState;
        case REMOVE_SESSION_USER:
            newState = Object.assign({}, state)
            newState.user = null;
            return newState
        default:
            return state
    }
}


export default sessionReducer;
