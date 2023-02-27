import { csrfFetch } from "./csrf";


const LOAD_ALL_GROUPS = 'groups/LOAD_ALL_GROUPS';


const loadGroups = groups => ({
    type: LOAD_ALL_GROUPS,
    groups
})

export const getAllGroups = () => async dispatch => {

    const response = await csrfFetch(`/api/groups`)

    if (response.ok) {
        const groups = await response.json();
        console.log(`loadGroups response: `, groups)
        dispatch(loadGroups(groups))
    }
}

const initialState = {
    allGroups: []
};

const groupsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_ALL_GROUPS:
            console.log(`action.groups:`, action.groups.Groups)
            return {
                ...state, allGroups: [...action.groups.Groups]
            }
        default:
            return state
    }
}


export default groupsReducer;
