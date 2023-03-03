import { bindActionCreators } from "redux";
import { csrfFetch } from "./csrf";

const LOAD_ALL_EVENTS = 'events/LOAD_ALL_EVENTS';
const GET_EVENT_DETAILS = 'events/GET_EVENT_DETAILS';
const CLEAR_CURRENT_EVENT = '/events/CLEAR_CURRENT_EVENT';
const DELETE_EVENT = '/events/DELETE_EVENT';

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
        case GET_EVENT_DETAILS:
            newState = { ...state, currentEvent: action.event };
            return newState;
        case CLEAR_CURRENT_EVENT:
            newState = { ...state, currentEvent: {} }
        case DELETE_EVENT:
            newState = { ...state };
            delete newState.allEvents[action.eventId];
        default:
            return state
    }
}

export default eventsReducer
