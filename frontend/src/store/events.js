import { csrfFetch } from "./csrf";

const LOAD_ALL_EVENTS = "events/LOAD_ALL_EVENTS";
const GET_EVENT_DETAILS = "events/GET_EVENT_DETAILS";
const ADD_EVENT = "events/UPDATE_EVENT";
const CLEAR_CURRENT_EVENT = "events/CLEAR_CURRENT_EVENT";
const DELETE_EVENT = "events/DELETE_EVENT";
const CLEAR_ALL_EVENTS = "events/CLEAR_ALL_EVENTS";
const GET_UPCOMING_EVENTS = "events/GET_UPCOMING_EVENTS";
const ADD_EVENT_IMAGE = "events/ADD_EVENT_IMAGE";
const GET_EVENT_IMAGES = "events/GET_EVENT_IMAGES";
const DELETE_EVENT_IMAGE = "events/DELETE_EVENT_IMAGE";

const deleteEventImage = (eventImageId) => ({
  type: DELETE_EVENT_IMAGE,
  eventImageId,
});

export const fetchDeleteEventImage =
  (eventId, eventImageId) => async (dispatch) => {
    const response = await csrfFetch(`/api/event-images/${eventImageId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      const eventImage = await response.json();
      console.log("fetch delete event image response json", eventImage);
      dispatch(deleteEventImage(eventImage?.deletedImage?.id));
      return eventImage;
    }
  };

const addEventImage = (eventId, eventImage) => ({
  type: ADD_EVENT_IMAGE,
  eventId,
  eventImage,
});

export const fetchCreateEventImage =
  (eventId, url, preview, name) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${eventId}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, preview, name }),
    });

    if (response.ok) {
      const eventImage = await response.json();
      // console.log("fetch create event image response json", eventImage);
      await dispatch(addEventImage(eventId, eventImage));
      return eventImage;
    }
  };

const getUpcomingEvents = (events) => ({
  type: GET_UPCOMING_EVENTS,
  events,
});

export const fetchUpcomingEvents = () => async (dispatch) => {
  let eventSearchParams = new URLSearchParams({
    futureOnlyQuery: true,
    earliestFirst: true,
    size: 10,
  });
  let response = await csrfFetch(`/api/events?${eventSearchParams}`);
  if (response.ok) {
    const events = await response.json();
    dispatch(getUpcomingEvents(events));
  }
};

const addEvent = (event) => ({
  type: ADD_EVENT,
  event,
});

export const fetchCreateEvent = (groupId, event) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });

  if (response.ok) {
    const event = await response.json();
    dispatch(addEvent(event));
    return event;
  }
};

export const fetchUpdateEvent = (eventId, event) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`, {
    method: "PUT",
    Headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });

  if (response.ok) {
    const event = await response.json();

    dispatch(addEvent(event));
    return event;
  }
};
export const clearAllEvents = () => ({
  type: CLEAR_ALL_EVENTS,
});

const removeEvent = (eventId) => ({
  type: DELETE_EVENT,
  eventId,
});

export const fetchDeleteEvent = (eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    const event = await response.json();
    dispatch(removeEvent(eventId));
    return event;
  }
};
export const clearCurrentEvent = () => ({
  type: CLEAR_CURRENT_EVENT,
});
const getEventDetails = (event) => ({
  type: GET_EVENT_DETAILS,
  event,
});

export const fetchEventDetails = (eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`);
  if (response.ok) {
    const event = await response.json();
    dispatch(getEventDetails(event));
    return event;
  }
};

const loadEvents = (events) => ({
  type: LOAD_ALL_EVENTS,
  events,
});
export const fetchAllEvents = (eventSearchQueries) => async (dispatch) => {
  let response;
  if (eventSearchQueries) {
    response = await csrfFetch(`/api/events?${eventSearchQueries}`);
  } else {
    response = await csrfFetch(`/api/events`);
  }
  if (response.ok) {
    const events = await response.json();
    dispatch(loadEvents(events));
  }
};

const initialState = {
  allEvents: [],
  upcomingEvents: [],
  currentEvent: {},
};

const eventsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case LOAD_ALL_EVENTS:
      return {
        ...state,
        allEvents: [...action.events.Events],
      };
    case ADD_EVENT:
      if (!state.allEvents[action.event.id]) {
        newState = {
          ...state,
          allEvents: [...state.allEvents, action.event],
        };
      } else {
        newState = {
          ...state,
          allEvents: [
            ...state.allEvents,
            state.allEvents[action.event.id],
            action.event,
          ],
        };
      }
    case CLEAR_ALL_EVENTS:
      return {
        ...state,
        allEvents: [],
      };
    case GET_EVENT_DETAILS:
      newState = { ...state, currentEvent: action.event };
      return newState;
    case CLEAR_CURRENT_EVENT:
      newState = { ...state, currentEvent: {} };
      return newState;
    case DELETE_EVENT:
      newState = { ...state };
      delete newState.allEvents[action.eventId];
    case GET_UPCOMING_EVENTS:
      return {
        ...state,
        upcomingEvents: [...action.events.Events],
      };
    case ADD_EVENT_IMAGE:
      console.log("dispatch add event image action");
      newState = { ...state };
      console.log("action.eventImage", action.eventImage);
      newState.currentEvent.EventImages = [
        ...newState.currentEvent.EventImages,
        action.eventImage,
      ];
      return newState;
    case DELETE_EVENT_IMAGE:
      newState = { ...state };
      newState.currentEvent.EventImages =
        newState.currentEvent.EventImages.filter(
          (image) => image.id !== action.eventImageId
        );
      return newState;
    default:
      return state;
  }
};

export default eventsReducer;
