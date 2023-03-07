import React, { useEffect } from "react";
import { useHistory, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./SeeAllGroups.css";
import { getAllGroups, clearCurrentGroup } from "../../../store/groups";
import EventsGroupsNav from "../../EventsGroupsNav";

function SeeAllGroups() {
    const dispatch = useDispatch();
    const history = useHistory();

    const groups = useSelector(state => {
        return state.groups.allGroups
    })
    let groupsArr = groups.map((group, idx) => {
        return (
            < div
                onClick={() => history.push(`/groups/${group.id}`)}
                key={idx} className="allEventsContainer" >
                <div className="groupContainer">
                    <img className="allGroupsImg" src={group.previewImage}></img>
                    <div className="groupContainerDetails">
                        <h3>{group.name}</h3>
                        <h4 id="allGroupsCity">{group.city}, {group.state}</h4>

                        <div className="EventsPrivacyDiv">
                            <h4 >{group.numEvents} Event(s) |</h4>
                            {group.private && <h4>private</h4>}
                            {!group.private && <h4>public</h4>}
                        </div>
                    </div>

                </div>
                <div className="pDiv">
                    <p className="allGroupsP">{group.about}</p>
                </div>
            </div >)

    })

    useEffect(() => {
        dispatch(getAllGroups())
        dispatch(clearCurrentGroup());
    }, [dispatch])

    return (
        <div className="seeAllGroupsMainDiv" >
            <ul className='EventsGroupsNav'>
                <li>
                    <NavLink className={`EventsGroupsLinks`} to='/events'>Events</NavLink>
                </li>
                <li><NavLink id="underlineGroups" className={`EventsGroupsLinks`} to='/groups'>Groups</NavLink>
                </li>
            </ul>
            <div className="belowEventsGroupsNav">
                <h2 id="GroupsInMeetup"> Groups in Meetup </h2>

                {groupsArr}
            </div>
        </div >
    );
}

export default SeeAllGroups;
