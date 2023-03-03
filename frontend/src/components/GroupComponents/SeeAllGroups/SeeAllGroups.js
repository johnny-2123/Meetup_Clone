import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
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
                    <div className="allEventsImgDiv">
                        <img className="allGroupsImg" src={group.previewImage}></img>
                    </div>
                    <div className="groupContainerDetails">
                        <h3>{group.name}</h3>
                        <h4>{group.city}</h4>

                        <div className="EventsPrivacyDiv">
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
        dispatch(getAllGroups())
        dispatch(clearCurrentGroup());
    }, [dispatch])

    return (

        < div className="seeAllGroupsMainDiv" >
            <EventsGroupsNav />
            <div className="seeAllh2">
                <h2 > Groups in Meetup </h2>
            </div>
            {groupsArr}
        </div >

    );
}

export default SeeAllGroups;
