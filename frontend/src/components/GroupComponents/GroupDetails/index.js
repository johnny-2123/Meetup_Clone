import React, { useEffect, useRef, useState } from 'react';
import { Redirect, Route, Switch, useLocation, useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import AlertConfirm from 'react-alert-confirm';
import * as groupActions from '../../../store/groups'
import * as sessionActions from '../../../store/session'
import './GroupDetails.css'

function GroupDetailsComponent() {
    const dispatch = useDispatch();
    const history = useHistory();
    const group = useSelector(state => state.groups.currentGroup);
    const sessionUser = useSelector(state => state.session.user);

    const events = useSelector(state => state.groups.currentGroupEvents)

    const { groupId } = useParams();

    const goBack = () => {
        history.goBack()
    }

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        dispatch(groupActions.fetchGroupDetails(groupId))
        dispatch(groupActions.fetchGroupEvents(groupId))
        setLoaded(true)
    }, [dispatch])

    const handleUpdateClick = () => {
        history.push(`/groups/${groupId}/edit`)
    }


    const handleDeleteClick = () => {
        AlertConfirm({
            title: 'Are you sure you want to delete this group',
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
        let eventDate = new Date(event.startDate);
        if (eventDate > now) {
            return (
                <div key={event.id} className='groupEventContainer'>
                    <img className='groupEventPicture' src='https://www.advenium.com/wp-content/uploads/2022/03/shutterstock_1464234134-1024x684-1.jpg' />
                    <div>
                        <div>
                            <h5>{eventDate.toLocaleDateString()} {eventDate.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}</h5>
                        </div>
                        <h4>{event.name}</h4>
                        <h5>{event.Venue?.city}, {event.Venue?.state}</h5>
                        <p>{event.description}</p>
                    </div>
                </div>
            )
        }

    })

    let pastGroupEventsMapped = events.map(event => {
        let now = new Date();
        let eventDate = new Date(event.startDate);
        if (eventDate < now) {
            return (
                <div key={event.id} className='groupEventContainer'>
                    <img className='groupEventPicture' src='https://www.advenium.com/wp-content/uploads/2022/03/shutterstock_1464234134-1024x684-1.jpg' />
                    <div>
                        <div>
                            <h5>{eventDate.toLocaleDateString()} {eventDate.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}</h5>
                        </div>
                        <h4>{event.name}</h4>
                        <h5>{event.Venue?.city}, {event.Venue?.state}</h5>
                        <p>{event.description}</p>
                    </div>
                </div>
            )
        }

    })


    return (
        loaded && < div className='MainGroupDetailsNav' >
            <div className='SubGroupDetailsNav'>
                <div className='backbuttonDiv'>
                    <button onClick={goBack} className='backButton'>{`< Groups`}</button>

                </div>
                <div className='groupInfoDiv'>
                    <img src='https://www.advenium.com/wp-content/uploads/2022/03/shutterstock_1464234134-1024x684-1.jpg' />
                    <div className='groupTextTopRightDiv'>
                        <div>
                            <h3>{group?.name}</h3>
                            <h4>{group?.city}, {group.state}</h4>
                            <div className='eventsPrivateDiv'>
                                <h4>{events.length} Events</h4>
                                <h4>{group?.private ? "Private" : "Public"}</h4>
                            </div>
                            <h4>Organized by {group?.Organizer?.firstName} {group?.Organizer?.lastName}</h4>
                        </div>
                        {sessionUser.user?.id === group?.Organizer?.id &&
                            <div >
                                <button className='sessionUserButtons'>Create event</button>
                                <button
                                    onClick={handleUpdateClick}
                                    className='sessionUserButtons'>Update</button>
                                <button
                                    onClick={handleDeleteClick}
                                    className='sessionUserButtons'>Delete</button>
                            </div>}
                    </div>
                </div>

            </div>
            <div className='groupTextBottomDiv'>
                <div className='subGroupTextBotttomDiv'>
                    <h3>Organizer</h3>
                    <h4 className='groupOrganizerUsername'>{group.Organizer?.username} user</h4>
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
