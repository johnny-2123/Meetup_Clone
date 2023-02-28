import { csrfFetch } from "./csrf";


const LOAD_ALL_GROUPS = 'groups/LOAD_ALL_GROUPS';
const ADD_Group = '/groups/ADD_GROUP';


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
        const groups = await response.json();

        dispatch(loadGroups(groups))
    }
}

const initialState = {
    allGroups: []
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
            }
        default:
            return state
    }
}


export default groupsReducer;
