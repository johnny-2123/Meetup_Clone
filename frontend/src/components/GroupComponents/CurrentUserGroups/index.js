import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUserGroups } from "../../../store/groups";
import "./CurrentUserGroups.css";
import CurrentUserGroupsDiv from "./currentUserGroupsDiv";

function SeeCurrentUserGroups() {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user?.user);
    const [loaded, setLoaded] = useState(false);

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
