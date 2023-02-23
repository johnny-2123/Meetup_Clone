import { csrfFetch } from "./csrf";

const SET_SESSION_USER = 'session/SET_SESSION_USER';
const REMOVE_SESSION_USER = 'session/REMOVE_SESSION_USER';


export const setSessionUser = (user) => {
    console.log(`setSessionUser user:`)
    console.log(user)
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

export const fetchLogin = (credential, password) => async dispatch => {
    console.log(`fetchLogin: `)
    console.log(credential, password);

    const response = await csrfFetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            credential,
            password
        })
    }).catch(async (res) => {
        const data = await res.json()
        console.log(`session store`)
        console.log(data)
        return data
    });

    if (response.ok) {
        console.log(`response`)
        console.log(response);
        const data = await response.json();

        console.log(`data`);
        console.log(data);
        await dispatch(setSessionUser(data));
        return data;
    } else return response
}

export const restoreUser = () => async dispatch => {
    const response = await csrfFetch('/api/session');
    const data = await response.json();
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
