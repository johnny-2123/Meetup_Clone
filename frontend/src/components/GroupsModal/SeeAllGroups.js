import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import "./SeeAllGroups.css";
import { getAllGroups } from "../../store/groups";
import EventsGroupsNav from "../EventsGroupsNav";

function SeeAllGroups() {
    const dispatch = useDispatch();

    const { closeModal } = useModal();

    const groups = useSelector(state => {
        return state.groups.allGroups
    })

    console.log(`seeAllGroups groups: `, groups);
    let groupsArr = groups.map((group, idx) => {
        console.log(`mapped group: `, group);
        return (
            <div className="allGroupsContainer">
                <div className="groupContainer">
                    <img className="allGroupsImg" src="https://res.cloudinary.com/dkul3ouvi/image/upload/v1677439417/5498791_i3opa9.jpg" alt="https://www.freepik.com/free-vector/solidarity-concept-illustration_14562369.htm#query=friends&position=4&from_view=search&track=sph"></img>
                    <div className="groupContainerDetails">
                        <h3>{group.name}</h3>
                        <h4>{group.city}</h4>
                        <p>{group.about}</p>
                        <div>
                            {group.private && <h4>private</h4>}
                            {!group.private && <h4>public</h4>}
                        </div>
                    </div>
                </div>

            </div>
        )
    })

    console.log(`groupsArr`, groupsArr)
    console.log(`groupsloaded in seeAllGroups Component:`, groups)

    useEffect(() => {
        dispatch(getAllGroups())
    }, [dispatch])

    return (
        <div className="seeAllGroupsMainDiv">
            <EventsGroupsNav />
            <div className="seeAllh2">
                <h2 > Groups in Meetup </h2>
            </div>
            {groupsArr}
        </div>
    );
}

export default SeeAllGroups;
