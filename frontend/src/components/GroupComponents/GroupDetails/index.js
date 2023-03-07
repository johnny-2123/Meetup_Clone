import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import AlertConfirm from 'react-alert-confirm';
import * as groupActions from '../../../store/groups';
import { fetchCurrentUserGroups } from "../../../store/groups";
import * as EventActions from '../../../store/events';
import * as sessionActions from '../../../store/session'
import './GroupDetails.css'

function GroupDetailsComponent() {
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();

    const group = useSelector(state => state.groups?.currentGroup);
    const sessionUser = useSelector(state => state.session?.user);
    const events = useSelector(state => state.groups?.currentGroupEvents)
    const userGroups = useSelector(state => {
        return state.groups?.currentUserGroups
    });

    const [loaded, setLoaded] = useState(false);
    const [userIsOrganizer, setUserIsOrganizer] = useState(false);
    const [userIsMember, setUserIsMember] = useState(false);
    useEffect(() => {
        sessionUser?.user?.id === group?.Organizer?.id ? setUserIsOrganizer(true) : setUserIsOrganizer(false)
        // for (let userGroup of userGroups) {
        //     console.log(`group.id`, group.id)
        //     console.log(`userGroup of UserGroups,`, userGroup);
        //     console.log(`sessionUser?.user?.id`, sessionUser?.user?.id);
        //     console.log(`userGroup?.organizerId`, userGroup?.organizerId);
        //     console.log(`userGroup.id`, userGroup.id);
        //     console.log(`userGroup.id`, userGroup.id);
        //     // (sessionUser?.user?.id === userGroup?.organizerId) && (group.id === userGroup.id) ? setUserIsGroupMember(true) : setUserIsGroupMember(false);
        //     // if ((sessionUser?.user?.id === userGroup?.organizerId) && (group.id === userGroup.id)) {
        //     //     return setUserIsGroupMember(true);
        //     // } else {
        //     //     setUserIsGroupMember(false)
        //     // }
        // }

        let userGroup = userGroups.find(ele => ele.id === group.id);
        console.log(`userGroup`, userGroup);
        userGroup?.currentUserGroupStatus && userGroup?.currentUserGroupStatus === 'active' ? setUserIsMember(true) : setUserIsMember(false)

    }, [sessionUser, userGroups, group])

    useEffect(() => {
        dispatch(groupActions.fetchGroupDetails(groupId))
        dispatch(groupActions.fetchGroupEvents(groupId))
        dispatch(fetchCurrentUserGroups(sessionUser?.id));
        dispatch(sessionActions.restoreUser())
        setLoaded(true)
    }, [dispatch, groupId])

    const goBack = () => {
        history.goBack()
    }

    const handleJoinGroup = () => {
        window.alert(`functionality coming soon`)
    }

    const handleLeaveGroupClick = () => {
        window.alert(`functionality coming soon`)
    }

    const handleCreateEventClick = () => [
        history.push(`/events/new`)

    ]
    const handleUpdateClick = () => {
        history.push(`/groups/${groupId}/edit`)
    }

    const handleDeleteClick = () => {
        AlertConfirm({
            title: 'Are you sure you want to delete this group?',
            desc: 'You cannot undo this change',
            onOk: () => {
                return dispatch(groupActions.fetchDeleteGroup(groupId))
                    .then(() => history.push(`/groups`))
                    .catch(async (res) => {
                        const data = await res.json();
                        if (data && data.errors) console.log(`data`, (data));
                    })
            },
            onCancel: () => {
            }
        });
    }

    let UpcomingGroupEventsMapped = events.map(event => {
        let now = new Date();
        let eventDate = new Date(event?.startDate);
        if (eventDate > now) {
            return (
                <div key={event.id}
                    onClick={() => history.push(`/events/${event.id}`)}
                    className='groupEventContainer'>
                    <img alt='group event' id='groupEventPicture' src={event.previewImage} />
                    <div className='groupEventsInfo'>
                        <div>
                            <h5 className='groupDetailsEventTime'>{eventDate.toLocaleDateString()} {eventDate.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}</h5>
                        </div>
                        <h4>{event?.name}</h4>
                        {event?.Venue?.city && <h5>{event?.Venue?.city}, {event?.Venue?.state}</h5>}
                        <p className='groupEventsDescriptionP'>{event?.description}</p>
                    </div>
                </div>
            )
        }

    })

    let pastGroupEventsMapped = events.map(event => {
        let now = new Date();
        let eventDate = new Date(event?.startDate);
        if (eventDate < now) {
            return (
                <div key={event.id}
                    onClick={() => history.push(`/events/${event.id}`)}
                    className='groupEventContainer'>
                    <img
                        alt='group event'
                        id='groupEventPicture' src={event.previewImage} />
                    <div className='groupEventsInfo'>
                        <div >
                            <h5 className='groupDetailsEventTime' >{eventDate.toLocaleDateString()} {eventDate.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}</h5>
                        </div>
                        <h4>{event?.name}</h4>
                        <h5>{event?.Venue?.city}, {event?.Venue?.state}</h5>
                        <p className='groupEventsDescriptionP'>{event?.description}</p>
                    </div>
                </div>
            )
        }

    })

    return (
        loaded && group?.previewImage && < div className='MainGroupDetailsNav' >
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
                            <div>
                                <button
                                    onClick={handleLeaveGroupClick}
                                    className='groupDetailsButton'>Leave Group</button>
                            </div>
                        }
                        {!userIsMember && !userIsOrganizer &&
                            <div>
                                <button
                                    onClick={handleLeaveGroupClick}
                                    className='groupDetailsButton'>Join Group</button>
                            </div>
                        }
                    </div>
                </div>

            </div>
            <div className='groupTextBottomDiv'>
                <div className='subGroupTextBotttomDiv'>
                    <h3>Organizer</h3>
                    <h4 id='groupOrganizerUsername'>{group?.Organizer?.username} user</h4>
                    <h3 className='aboutHeader'>What we're about</h3>
                    <p className='aboutP'>{group?.about}</p>
                    <h3 className='upcomingEvents' >Upcoming Events</h3>
                    {UpcomingGroupEventsMapped.length > 0 && UpcomingGroupEventsMapped}
                    {UpcomingGroupEventsMapped.length === 0 && <h4>No upcoming events</h4>}
                    <h3>Past Events</h3>
                    {pastGroupEventsMapped.length > 0 && pastGroupEventsMapped}
                    {pastGroupEventsMapped.length === 0 && <h4>No Past Events</h4>}
                </div>
            </div>
        </div >
    )
}

export default GroupDetailsComponent;
