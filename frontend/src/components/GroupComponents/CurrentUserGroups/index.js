import React, { useEffect, useReducer, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUserGroups } from "../../../store/groups";
import * as groupActions from '../../../store/groups';
import AlertConfirm from 'react-alert-confirm';
import "./CurrentUserGroups.css";
import CurrentUserGroupsDiv from "./currentUserGroupsDiv";

function SeeCurrentUserGroups() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const sessionUser = useSelector(state => state.session.user?.user);
    const [loaded, setLoaded] = useState(false);

    const userGroups = useSelector(state => {
        return state.groups?.currentUserGroups
    });

    useEffect(() => {
        dispatch(fetchCurrentUserGroups(sessionUser?.id));
        setLoaded(true)
    }, [dispatch])

    useEffect(() => {

    }, [dispatch])

    return (
        < div className="seeAllGroupsMainDiv" >
            <div className="belowEventsGroupsNav">
                <div className="seeAllh2">
                    <h2 className="manageGroups">Manage Groups</h2>
                    <h3 className="yourGroupsInMeetup">Your Groups in Meetup</h3>
                </div>
                <CurrentUserGroupsDiv />

            </div >
        </div>
    );
}

export default SeeCurrentUserGroups;
