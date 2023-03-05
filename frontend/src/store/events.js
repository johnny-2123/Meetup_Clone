import { bindActionCreators, compose } from "redux";
import { csrfFetch } from "./csrf";

const LOAD_ALL_EVENTS = 'events/LOAD_ALL_EVENTS';
const GET_EVENT_DETAILS = 'events/GET_EVENT_DETAILS';
const ADD_EVENT = 'events/UPDATE_EVENT';
const CLEAR_CURRENT_EVENT = 'events/CLEAR_CURRENT_EVENT';
const DELETE_EVENT = 'events/DELETE_EVENT';
const CLEAR_ALL_EVENTS = 'events/CLEAR_ALL_EVENTS';
const GET_CURRENT_USER_EVENTS = 'events/GET_CURRENT_USER_EVENTS';

const loadCurrentUserEvents = (events) => ({
    type: GET_CURRENT_USER_EVENTS,
    events
});

// export const fetchCurrentUserEvents = (userId) => async dispatch => {
//     const response = await csrfFetch('')
// }

const addEvent = (event) => ({
    type: ADD_EVENT,
    event
})

export const fetchCreateEvent = (groupId, event) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}/events`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
    });

    console.log(`fetchCreateEvent store res`, response);

    if (response.ok) {
        const event = await response.json();
        console.log(`fetchCreateEvent store res.json`, event)
        dispatch(addEvent(event));
        return event;
    }
}

export const fetchUpdateEvent = (eventId, event) => async dispatch => {
    const response = await csrfFetch(`/api/events/${eventId}`, {
        method: 'PUT',
        Headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
    });

    console.log(`fetchUpdate group res`, response);
    if (response.ok) {
        const event = await response.json();
        console.log(`fetchUpdate event to.json`, event);
        dispatch(addEvent(event));
        return event;
    }
}
export const clearAllEvents = () => ({
    type: CLEAR_ALL_EVENTS
})


const removeEvent = (eventId) => ({
    type: DELETE_EVENT,
    eventId
});

export const fetchDeleteEvent = (eventId) => async dispatch => {
    const response = await csrfFetch(`/api/events/${eventId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        const event = await response.json();
        console.log(`fetchDeleteEvent ok.json res:`, event);
        dispatch(removeEvent(eventId));
        return event
    }


}
export const clearCurrentEvent = () => ({
    type: CLEAR_CURRENT_EVENT
})
const getEventDetails = event => ({
    type: GET_EVENT_DETAILS,
    event
})

export const fetchEventDetails = (eventId) => async dispatch => {
    const response = await csrfFetch(`/api/events/${eventId}`);
    console.log(`fetchEventDetails Response:`, response)
    if (response.ok) {
        const event = await response.json();
        console.log('eventDetails.json()', event);
        dispatch(getEventDetails(event));
        return event;
    }
}

const loadEvents = events => ({
    type: LOAD_ALL_EVENTS,
    events
})
export const fetchAllEvents = () => async dispatch => {
    const response = await csrfFetch(`/api/events`)
    console.log(`fetchAllEvents Response: `, response)
    if (response.ok) {
        const events = await response.json();
        console.log(`events.tojson`, events)
        dispatch(loadEvents(events))
    }
}

const initialState = {
    allEvents: [],
    currentEvent: {}
}


const eventsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_ALL_EVENTS:
            return {
                ...state, allEvents: [...action.events.Events]
            };
        case ADD_EVENT:
            if (!state.allEvents[action.event.id]) {
                newState = {
                    ...state, allEvents: [...state.allEvents, action.event]
                };
            } else {
                newState = {
                    ...state, allEvents: [...state.allEvents, state.allEvents[action.event.id], action.event]
                }
            }
        case CLEAR_ALL_EVENTS:
            return {
                ...state, allEvents: []
            };
        case GET_EVENT_DETAILS:
            newState = { ...state, currentEvent: action.event };
            return newState;
        case CLEAR_CURRENT_EVENT:
            newState = { ...state, currentEvent: {} }
            return newState
        case DELETE_EVENT:
            newState = { ...state };
            delete newState.allEvents[action.eventId];
        default:
            return state
    }
}

export default eventsReducer
