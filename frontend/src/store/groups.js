import { csrfFetch } from "./csrf";
const LOAD_ALL_GROUPS = 'groups/LOAD_ALL_GROUPS';
const ADD_Group = '/groups/ADD_GROUP';
const GET_GROUP_DETAILS = '/groups/GET_GROUP_DETAILS'
const GET_GROUP_EVENTS = '/groups/GET_GROUP_EVENTS';
const CLEAR_CURRENT_GROUP = '/groups/CLEAR_CURRENT_GROUP';
const DELETE_GROUP = '/groups/DELETE_GROUP';
const GET_CURRENT_USER_GROUPS = '/groups/GET_CURRENT_USER_GROUPS';
const UNJOIN_GROUP = '/groups/UNJOIN_GROUP';
const GET_GROUP_MEMBERS = '/groups/GET_GROUP_MEMBERS';
const EDIT_GROUP_MEMBER = '/groups/EDIT_GROUP_MEMBER';
const DELETE_GROUP_MEMBER = '/groups/DELETE_GROUP_MEMBER';


const deleteGroupMember = (memberId) => ({
    type: DELETE_GROUP_MEMBER,
    memberId
});

export const fetchDeleteGroupMember = (groupId, memberId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}/membership`, {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId, memberId })
    });

    if (response.ok) {
        const groupMember = await response.json();
        dispatch(deleteGroupMember(memberId));
        return groupMember;
    }
}

const editGroupMember = (groupMember, status) => ({
    type: EDIT_GROUP_MEMBER,
    groupMember,
    status
})

export const fetchEditGroupMember = (groupId, memberId, status) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}/membership`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, status })
    });

    if (response.ok) {
        const groupMember = await response.json();
        dispatch(editGroupMember(groupMember, groupMember.status))
        return groupMember;
    }
}

const getGroupmembers = (groupMembers) => ({
    type: GET_GROUP_MEMBERS,
    groupMembers
});

export const fetchGetGroupMembers = (groupId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}/members`, {
        method: "GET"
    });

    if (response.ok) {
        const groupMembers = await response.json();
        dispatch(getGroupmembers(groupMembers));
        return groupMembers;
    }
}

export const fetchJoinGroup = (groupId, memberId) => async dispatch => {

    const response = await csrfFetch(`/api/groups/${groupId}/membership`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId })
    });

    if (response.ok) {
        const member = await response.json();
        dispatch(unjoinGroup(groupId, memberId));
        return member;
    }
}

const unjoinGroup = (groupId, memberId) => ({
    type: UNJOIN_GROUP,
    groupId,
    memberId
});

export const fetchUnjoinGroup = (groupId, memberId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}/membership`, {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId })
    });

    if (response.ok) {
        const member = await response.json();
        dispatch(unjoinGroup(groupId, memberId));
        return member;
    }
}

const loadCurrentUserGroups = (groups) => ({
    type: GET_CURRENT_USER_GROUPS,
    groups
});

export const fetchCurrentUserGroups = (userId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/current`)

    if (response.ok) {
        const groups = await response.json();
        dispatch(loadCurrentUserGroups(groups));
        return groups;
    }
}

const removeGroup = (groupId) => ({
    type: DELETE_GROUP,
    groupId
})

export const fetchDeleteGroup = (groupId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}`, {
        method: "DELETE"
    });

    if (response.ok) {
        const group = await response.json();
        dispatch(removeGroup(groupId));
        return group
    }

}

export const fetchUpdateGroup = (groupId, group) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(group)
    });

    if (response.ok) {
        const group = await response.json();
        dispatch(addGroup(group));
        return group
    }
}

export const clearCurrentGroup = () => ({
    type: CLEAR_CURRENT_GROUP
})

const getGroupEvents = (groupEvents) => ({
    type: GET_GROUP_EVENTS,
    groupEvents
});

export const fetchGroupEvents = (groupId) => async dipatch => {
    const response = await csrfFetch(`/api/groups/${groupId}/events`);

    if (response.ok) {
        const data = await response.json();
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

    const response = await csrfFetch(`/api/groups/${groupId}`);

    if (response.ok) {
        const data = await response.json()

        dispatch(getGroupDetails(data));
        return data;
    }
}

const addGroup = group => ({
    type: ADD_Group,
    group
});

export const fetchCreateGroup = (group) => async dispatch => {
    const response = await csrfFetch(`/api/groups`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(group)
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
        const groups = await response.json();
        dispatch(loadGroups(groups))
    }
}

const initialState = {
    allGroups: [],
    currentGroup: {},
    currentGroupEvents: [],
    currentUserGroups: [],
    groupMembers: {}
};

const groupsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_ALL_GROUPS:
            return {
                ...state, allGroups: [...action.groups.Groups]
            };
        case GET_CURRENT_USER_GROUPS:
            let normalizedUserGroups = {};
            action.groups.Groups.forEach(group => {
                normalizedUserGroups[group.id] = group
            });

            newState = {
                ...state, currentUserGroups: { ...normalizedUserGroups }
            }
            return newState
        case ADD_Group:
            if (!state.allGroups[action.group.id]) {
                newState = {
                    ...state, allGroups: [...state.allGroups, action.group]
                };
                return newState
            } else {
                newState = {
                    ...state, allGroups: [...state.allGroups, state.allGroups[action.group.id], action.group]
                }
                return newState
            };
        case GET_GROUP_DETAILS:
            newState = { ...state, currentGroup: action.group }
            return newState
        case CLEAR_CURRENT_GROUP:
            newState = {
                ...state, currentGroup: {}
            };
            return newState
        case GET_GROUP_EVENTS:
            newState = { ...state, currentGroupEvents: action.groupEvents }
            return newState;
        case DELETE_GROUP:
            newState = { ...state };
            delete newState.allGroups[action.groupId]
            return newState;
        case GET_GROUP_MEMBERS:
            let normalizedGroupMembers = {};
            action.groupMembers.Members.forEach(member => { normalizedGroupMembers[member.id] = member });
            newState = { ...state, groupMembers: { ...normalizedGroupMembers } }
            return newState;
        case EDIT_GROUP_MEMBER:
            newState = {
                ...state,
            }
            newState.groupMembers[action.groupMember.memberId].Membership.status = action.status
            return newState
        case DELETE_GROUP_MEMBER:
            newState = {
                ...state
            };
            delete newState.groupMembers[action.memberId];
            return newState;
        default:
            return state
    }
}


export default groupsReducer;
