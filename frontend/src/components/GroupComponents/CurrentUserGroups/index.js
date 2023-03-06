import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./CurrentUserGroups.css";
import { fetchCurrentUserGroups } from "../../../store/groups";

function SeeCurrentUserGroups() {
    const dispatch = useDispatch();
    const history = useHistory();

    const sessionUser = useSelector(state => state.session.user?.user);

    const userGroups = useSelector(state => {
        return state.groups?.currentUserGroups
    });

    useEffect(() => {
        dispatch(fetchCurrentUserGroups(sessionUser?.id));
    }, [dispatch])

    console.log(`userGroups from seeCurrentUserGroups selector`, userGroups);
    let groupsArr = userGroups?.map((group, idx) => {
        return (
            < div
                onClick={() => history.push(`/groups/${group.id}`)}
                key={idx} className="allEventsContainer" >
                <div className="groupContainer">

                    <img className="allGroupsImg" src={group.previewImage}></img>

                    <div className="groupContainerDetails">
                        <h3>{group.name}</h3>
                        <h4 id="myGroupsCity">{group.city}, {group.state}</h4>
                        <div id="myGroupsPrivacyDiv" className="EventsPrivacyDiv">
                            <h4>{group.numEvents} Event(s)</h4>
                            {group.private && <h4>private</h4>}
                            {!group.private && <h4>public</h4>}
                        </div>
                    </div>

                </div>
                <p>{group.about}</p>
            </div >)

    })

    useEffect(() => {

    }, [dispatch])

    return (

        < div className="seeAllGroupsMainDiv" >
            <div className="belowEventsGroupsNav">
                <div className="seeAllh2">
                    <h2 > Your Groups in Meetup </h2>
                </div>
                {groupsArr}
            </div >
        </div>
    );
}

export default SeeCurrentUserGroups;
