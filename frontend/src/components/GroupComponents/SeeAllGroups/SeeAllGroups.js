import React, { useEffect, useState } from "react";
import * as sessionActions from "../../../store/session";
import { Redirect, Route, Switch, useLocation, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import "./SeeAllGroups.css";
import { getAllGroups, clearCurrentGroup } from "../../../store/groups";
import EventsGroupsNav from "../../EventsGroupsNav";
import GroupDetailsComponent from "../GroupDetails";

function SeeAllGroups() {
    const dispatch = useDispatch();
    const [GroupListShow, setGroupListShow] = useState(true);

    const history = useHistory();
    const location = useLocation();
    let currentPath = location.pathname;
    useEffect(() => {
        if (currentPath === '/groups') {
            setGroupListShow(true)
        } else {
            setGroupListShow(false)
        }
    }, [currentPath])



    const groups = useSelector(state => {
        return state.groups.allGroups
    })
    let groupsArr = groups.map((group, idx) => {
        return (
            < div key={idx} className="allGroupsContainer" >
                <div onClick={() => history.push(`/groups/${group.id}`)} className="groupContainer">
                    <img className="allGroupsImg" src="https://res.cloudinary.com/dkul3ouvi/image/upload/v1677439417/5498791_i3opa9.jpg" alt="https://www.freepik.com/free-vector/solidarity-concept-illustration_14562369.htm#query=friends&position=4&from_view=search&track=sph"></img>
                    <div className="groupContainerDetails">
                        <h3>{group.name}</h3>
                        <h4>{group.city}</h4>
                        <p>{group.about}</p>
                        <div className="EventsPrivacyDiv">
                            <h4>{group.numEvents} Events</h4>
                            {group.private && <h4>private</h4>}
                            {!group.private && <h4>public</h4>}
                        </div>
                    </div>
                </div>

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
