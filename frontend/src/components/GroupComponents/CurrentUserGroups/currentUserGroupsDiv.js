import React, { useEffect, useReducer } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUnjoinGroup } from "../../../store/groups";
import * as groupActions from '../../../store/groups';
import AlertConfirm from 'react-alert-confirm';
import "./CurrentUserGroups.css";


function CurrentUserGroupsDiv({ }) {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user?.user);
    const history = useHistory();

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const userGroups = useSelector(state => {
        return state.groups?.currentUserGroups
    });

    useEffect(() => {

    }, [userGroups]);

    const userGroupsArray = Object.values(userGroups);

    const handleCurrentUserGroupUnjoinClick = (e, groupId) => {
        e.stopPropagation();

        AlertConfirm({
            title: 'Are you sure you want to delete this Group?',
            desc: 'You cannot undo this change',
            onOk: () => {
                return dispatch(fetchUnjoinGroup(groupId, sessionUser.id))
                    .then(() => forceUpdate())
                    .catch(async (res) => {
                        const data = await res.json();
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
                    .then(() => forceUpdate())
                    .catch(async (res) => {
                        const data = await res.json();
                    })
            },
            onCancel: () => {
                document.documentElement.style.overflow = 'scroll';
                document.body.scroll = "yes";
            }
        });

    }

    let groupsArr = userGroupsArray?.map((group, idx) => {
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
                        {group?.currentUserGroupStatus && group?.currentUserGroupStatus === 'pending' && <h5 className="membershipPending">* Membership pending</h5>}
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


    return (
        <>
            {groupsArr}
            {groupsArr?.length === 0 && <h3 className="noGroupsJoinedOrCreated">Join or create a group to see it listed here</h3>}

        </>
    )

}


export default CurrentUserGroupsDiv;
