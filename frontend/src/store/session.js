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

const initialState = {
    user: null
}

const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SESSION_USER:

    }
}


export default sessionReducer;
