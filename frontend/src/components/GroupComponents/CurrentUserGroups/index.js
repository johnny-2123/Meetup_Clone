import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUserGroups, fetchUnjoinGroup } from "../../../store/groups";
import * as groupActions from '../../../store/groups';
import AlertConfirm from 'react-alert-confirm';
import "./CurrentUserGroups.css";

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

    const handleCurrentUserGroupUnjoinClick = (e, groupId) => {
        e.stopPropagation();

        AlertConfirm({
            title: 'Are you sure you want to delete this Group?',
            desc: 'You cannot undo this change',
            onOk: () => {
                return dispatch(fetchUnjoinGroup(groupId, sessionUser.id))
                    .then(() => history.push(`/groups/current`))
                    .then(() => window.location.reload())
                    .catch(async (res) => {
                        const data = await res.json();
                        if (data && data.errors) console.log(`data`, (data));
                    })
            },
            onCancel: () => {
            }
        });

    }

    const handleCurrentUserGroupUpdateClick = (e, groupId) => {
        e.stopPropagation();
        history.push(`/groups/${groupId}/edit`)
    }

    const handleCurrentUserGroupDeleteOnClick = (e, groupId) => {
        e.stopPropagation();
        document.documentElement.style.overflow = 'hidden';
        document.body.scroll = "no";
        AlertConfirm({
            title: 'Are you sure you want to delete this group?',
            desc: 'You cannot undo this change',
            onOk: () => {
                document.documentElement.style.overflow = 'scroll';
                document.body.scroll = "yes";
                return dispatch(groupActions.fetchDeleteGroup(groupId))
                    .then(() => history.push(`/groups/current`))
                    .then(() => window.location.reload())
                    .catch(async (res) => {
                        const data = await res.json();
                        if (data && data.errors) console.log(`data`, (data));
                    })
            },
            onCancel: () => {
                document.documentElement.style.overflow = 'scroll';
                document.body.scroll = "yes";
            }
        });

    }


    let groupsArr = userGroups?.map((group, idx) => {
        return (
            < div
                onClick={() => history.push(`/groups/${group?.id}`)}
                key={idx} className="allEventsContainer" >
                <div id="currentUserGroupsDiv" className="groupContainer">

                    <img className="allGroupsImg" src={group?.previewImage}></img>

                    <div id="currentUserGroupsContainerDetails" className="groupContainerDetails">
                        <h3 id="currentUserGroupsName">{group?.name}</h3>
                        <h4 id="myGroupsCity">{group?.city}, {group?.state}</h4>
                        <div id="myGroupsPrivacyDiv" className="EventsPrivacyDiv">
                            <h4>{group.numMembers} Members(s) | </h4>
                            {group?.private && <h4>private</h4>}
                            {!group?.private && <h4>public</h4>}
                        </div>
                        {group?.currentUserGroupStatus && group?.currentUserGroupStatus === 'active' &&
                            <div className="currentUserGroupButtonDiv">
                                <button
                                    onClick={(e) => handleCurrentUserGroupUnjoinClick(e, group.id)}
                                    className="groupDetailsButton" >unjoin</button>
                            </div>}
                        {group?.organizerId === sessionUser?.id &&
                            <div className="currentUserGroupButtonDiv">
                                <button
                                    onClick={(e) => handleCurrentUserGroupUpdateClick(e, group.id)}
                                    id='currentUserGroupUpdateButton'
                                    className="groupDetailsButton" >Update</button>
                                <button
                                    onClick={(e) => handleCurrentUserGroupDeleteOnClick(e, group.id)}
                                    id='currentUserGroupDeleteButton'
                                    className="groupDetailsButton" >Delete</button>
                            </div>}
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
                    <h2 className="manageGroups">Manage Groups</h2>
                    <h3 className="yourGroupsInMeetup">Your Groups in Meetup</h3>
                </div>
                {groupsArr}
            </div >
        </div>
    );
}

export default SeeCurrentUserGroups;
