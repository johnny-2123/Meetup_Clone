import { bindActionCreators } from "redux";
import { csrfFetch } from "./csrf";

const LOAD_ALL_EVENTS = 'events/LOAD_ALL_EVENTS';

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
    allEvents: []
}


const eventsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_ALL_EVENTS:
            return {
                ...state, allEvents: [...action.events.Events]
            };
        default:
            return state
    }
}

export default eventsReducer
