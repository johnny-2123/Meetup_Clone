import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import AlertConfirm from 'react-alert-confirm';
import * as groupActions from '../../../store/groups';
import { fetchCurrentUserGroups, fetchUnjoinGroup, fetchJoinGroup, fetchGetGroupMembers } from "../../../store/groups";
import * as sessionActions from '../../../store/session'
import GroupMembersComponent from '../GroupMembers';
import GroupEventsComponent from './GroupEvents';
import './GroupDetails.css'

function GroupDetailsComponent() {
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();

    const group = useSelector(state => state.groups?.currentGroup);
    const sessionUser = useSelector(state => state.session?.user);
    const events = useSelector(state => state.groups?.currentGroupEvents);
    const members = useSelector(state => state.groups?.groupMembers);

    const userGroups = useSelector(state => {
        return state.groups?.currentUserGroups
    });

    const [loaded, setLoaded] = useState(false);
    const [userIsOrganizer, setUserIsOrganizer] = useState(false);
    const [userIsMember, setUserIsMember] = useState(false);
    const [membershipRequested, setMembershipRequested] = useState(false);
    const [showGroupMembers, setShowGroupMembers] = useState(false);
    const [showGroupEvents, setShowGroupEvents] = useState(true);


    useEffect(() => {
        sessionUser?.user?.id === group?.Organizer?.id ? setUserIsOrganizer(true) : setUserIsOrganizer(false)

        let userGroup = userGroups.find(ele => ele.id === group.id);

        userGroup?.currentUserGroupStatus && (userGroup?.currentUserGroupStatus === ('active') || userGroup?.currentUserGroupStatus === ('co-host')) ? setUserIsMember(true) : setUserIsMember(false);

        userGroup?.currentUserGroupStatus && userGroup?.currentUserGroupStatus === ('pending') ? setMembershipRequested(true) : setMembershipRequested(false);

    }, [sessionUser, userGroups, group, members])

    useEffect(() => {
        dispatch(groupActions.fetchGroupDetails(groupId))
        dispatch(groupActions.fetchGroupEvents(groupId))
        dispatch(fetchCurrentUserGroups(sessionUser?.id));
        dispatch(fetchGetGroupMembers(groupId));
        dispatch(sessionActions.restoreUser())
        setLoaded(true)
    }, [dispatch, groupId])

    const goBack = () => {
        history.goBack()
    }

    let viewMembersGroupDetailsClass = showGroupMembers ? "viewMemberGroupDetailsButtonClicked" : "viewMemberGroupDetailsButton"
    let viewEventsGroupDetailsClass = showGroupEvents ? "viewMemberGroupDetailsButtonClicked" : "viewMemberGroupDetailsButton"

    const handleViewGroupEvents = () => {
        if (showGroupEvents === false) {
            setShowGroupEvents(true)
            setShowGroupMembers(false)
        }
    }

    const handleViewMembersGroupDetailsButton = () => {
        if (showGroupMembers === false) {
            setShowGroupMembers(true);
            setShowGroupEvents(false);
        }
    }

    const handleJoinGroup = () => {

        if (!sessionUser?.user) {
            return window.alert(`must be logged in to join group`);
        }

        if (!membershipRequested) {
            return dispatch(fetchJoinGroup(groupId, sessionUser?.user?.id))
                .then(() => setMembershipRequested(true))
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) console.log(`data`, (data));
                })
        } else {
            handleLeaveGroupClick(groupId);
            setMembershipRequested(false)
        }

    }

    const handleLeaveGroupClick = (groupId) => {
        return dispatch(fetchUnjoinGroup(groupId, sessionUser?.user?.id))
            .then(() => setUserIsMember(false))
        // .catch(async (res) => {
        //     const data = await res.json();
        //     if (data && data.errors) console.log(`data`, (data));
        // })
    }

    const handleCreateEventClick = () => [
        history.push(`/groups/${groupId}/events`)

    ]
    const handleUpdateClick = () => {
        history.push(`/groups/${groupId}/edit`)
    }

    const handleDeleteClick = () => {
        document.documentElement.style.overflow = 'hidden';
        document.body.scroll = "no";
        AlertConfirm({
            title: 'Are you sure you want to delete this group?',
            desc: 'You cannot undo this change',
            onOk: () => {
                document.documentElement.style.overflow = 'scroll';
                document.body.scroll = "yes";
                return dispatch(groupActions.fetchDeleteGroup(groupId))
                    .then(() => window.location.reload())
                // .catch(async (res) => {
                //     const data = await res.json();
                //     if (data && data.errors) console.log(`data`, (data));
                // })
            },
            onCancel: () => {
                document.documentElement.style.overflow = 'scroll';
                document.body.scroll = "yes";
            }
        });
    }
    return (
        <>
            {loaded && group?.previewImage && < div className='MainGroupDetailsNav' >
                <div className='SubGroupDetailsNav'>
                    <div className='backbuttonDiv'>
                        <button onClick={goBack} className='backButton'>{`< Back`}</button>
                    </div>
                    <div className='groupInfoDiv'>
                        <img id='groupDetailsMainImage' alt='group' src={group?.previewImage} />
                        <div className='groupTextTopRightDiv'>
                            <div  >
                                {group?.name && <h3>{group?.name}</h3>}
                                <div className='groupLocationPrivacyDiv'>
                                    {group?.city && <h4>{group?.city}, {group.state}</h4>}
                                    <div className='eventsPrivateDiv'>
                                        <h4 id='groupDetailsEventsNumber'>{events?.length} Event(s)|</h4>
                                        <h4>{group?.private ? "Private" : "Public"}</h4>
                                    </div>
                                </div>
                                <h4>Organized by {group?.Organizer?.firstName} {group?.Organizer?.lastName}</h4>
                            </div>

                            {userIsOrganizer && !userIsMember &&
                                <div className='groupDetailsButtonsDiv' >
                                    <button
                                        onClick={handleCreateEventClick}
                                        className='groupDetailsButton'>Create event</button>
                                    <button
                                        onClick={handleUpdateClick}
                                        className='groupDetailsButton'>Update</button>
                                    <button
                                        onClick={handleDeleteClick}
                                        id='groupDetailsDeleteButton'
                                        className='groupDetailsButton'>Delete</button>
                                </div>}
                            {userIsMember && !userIsOrganizer &&
                                <div className='groupDetailsButtonsDiv'>
                                    <button
                                        id='groupDetailsUnjoinButton'
                                        onClick={() => handleLeaveGroupClick(group?.id)}
                                        className='groupDetailsButton'>Unjoin</button>
                                </div>
                            }
                            {!userIsMember && !userIsOrganizer && !membershipRequested &&
                                <div className='groupDetailsButtonsDiv'>
                                    <button
                                        onClick={() => handleJoinGroup()}
                                        className='groupDetailsButton'>Join Group</button>
                                </div>
                            }

                            {membershipRequested && <div className='groupDetailsButtonsDiv'>
                                <button
                                    onClick={() => handleJoinGroup()}
                                    id='membershipRequested'
                                    className='groupDetailsButton'>Cancel Membership Request</button>
                            </div>}
                        </div>
                    </div>

                </div>
                <div className='groupTextBottomDiv'>
                    <div className='subGroupTextBotttomDiv'>
                        <h3>Organizer</h3>
                        <h4 id='groupOrganizerUsername'>{group?.Organizer?.username} user</h4>
                        <h3 className='aboutHeader'>What we're about</h3>
                        <p className='aboutP'>{group?.about}</p>
                        <ul className='GroupDetailsNavButtons'>
                            <li>
                                <button
                                    onClick={handleViewGroupEvents}
                                    className={viewEventsGroupDetailsClass}>Events</button>
                                <button
                                    onClick={handleViewMembersGroupDetailsButton}
                                    className={viewMembersGroupDetailsClass}
                                >
                                    Members</button>

                            </li>
                        </ul>

                        {
                            showGroupEvents && <GroupEventsComponent events={events} />
                        }
                        {
                            showGroupMembers && <GroupMembersComponent
                                organizerId={group?.Organizer?.id}
                                userIsOrganizer={userIsOrganizer} members={members} groupId={groupId} />
                        }
                    </div>
                </div>
            </div >}
        </>
    )
}

export default GroupDetailsComponent;
