import { csrfFetch } from "./csrf";


const LOAD_ALL_GROUPS = 'groups/LOAD_ALL_GROUPS';
const ADD_Group = '/groups/ADD_GROUP';
const GET_GROUP_DETAILS = '/groups/GET_GROUP_DETAILS'
const GET_GROUP_EVENTS = '/groups/GET_GROUP_EVENTS';
const CLEAR_CURRENT_GROUP = '/groups/CLEAR_CURRENT_GROUP';

export const clearCurrentGroup = () => ({
    type: CLEAR_CURRENT_GROUP,
})

const getGroupEvents = (groupEvents) => ({
    type: GET_GROUP_EVENTS,
    groupEvents
});

export const fetchGroupEvents = (groupId) => async dipatch => {
    const response = await csrfFetch(`/api/groups/${groupId}/events`);

    console.log(`fetchGroupEvents response:`, response);

    if (response.ok) {
        const data = await response.json();
        console.log(`groupEvents dispatched to reducer: `, data);
        dipatch(getGroupEvents(data.Events));
        return data
    } else {
        return response.errors
    }
}



const getGroupDetails = (group) => ({
    type: GET_GROUP_DETAILS,
    group
})


export const fetchGroupDetails = (groupId) => async dispatch => {

    console.log(`fetchGroup details line 37`);

    const response = await csrfFetch(`/api/groups/${groupId}`);

    console.log(`fetchGroupDetails response:`, response)

    if (response.ok) {
        const data = await response.json()

        console.log(`group details dispatched to reducer: `, data)
        dispatch(getGroupDetails(data));
        return data;
    }
}

const addGroup = group => ({
    type: ADD_Group,
    group
});

export const fetchCreateGroup = (payload) => async dispatch => {
    const response = await csrfFetch(`/api/groups`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (response.ok) {
        const group = await response.json();
        dispatch(addGroup(group));
        return group
    }
}

const loadGroups = groups => ({
    type: LOAD_ALL_GROUPS,
    groups
})

export const getAllGroups = () => async dispatch => {

    const response = await csrfFetch(`/api/groups`)

    if (response.ok) {
        console.log(`getAllgroups response`, response)
        const groups = await response.json();

        dispatch(loadGroups(groups))
    }
}

const initialState = {
    allGroups: [],
    currentGroup: {},
    currentGroupEvents: []
};

const groupsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_ALL_GROUPS:
            console.log(`action.groups:`, action.groups.Groups)
            return {
                ...state, allGroups: [...action.groups.Groups]
            };
        case ADD_Group:
            console.log(`ADD_GROUP action.Group line 57:  `, action.group)
            if (!state.allGroups[action.group.id]) {
                newState = {
                    ...state, allGroups: [...state.allGroups, action.group]
                };
                return newState
            } else {
                console.log(`ADD_GROUP action.Group: line 64: `, action.group)
                return {
                    ...state, allGroups: [...state.allGroups, ...state.allGroups[action.group.id], action.group]
                }
            };
        case GET_GROUP_DETAILS:
            console.log(`group reducer action.group: `, action.group);
            newState = { ...state, currentGroup: action.group }
            return newState
        case CLEAR_CURRENT_GROUP:
            newState = {
                ...state, currentGroup: {}
            };
            return newState
        case GET_GROUP_EVENTS:
            console.log(`group reducer action.groupEvents:`, action.groupEvents);
            newState = { ...state, currentGroupEvents: action.groupEvents }
            return newState;
        default:
            return state
    }
}


export default groupsReducer;
