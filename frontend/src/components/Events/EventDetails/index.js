import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import AlertConfirm from 'react-alert-confirm';
import * as eventActions from '../../../store/events'
import * as sessionActions from '../../../store/session'
import './EventDetails.css'
<script src="https://kit.fontawesome.com/97726b2eee.js" crossorigin="anonymous"></script>

function EventDetailsComponent() {
    const { eventId } = useParams();
    console.log(`eventId: `, eventId)
    const dispatch = useDispatch();
    const history = useHistory();

    const event = useSelector(state => state.events?.currentEvent);
    let eventDate = new Date(event?.startDate);
    let eventEndDate = new Date(event?.endDate);
    const sessionUser = useSelector(state => state.session?.user);

    const [loaded, setLoaded] = useState(false);
    const [isOrganizer, setIsOrganizer] = useState(false)


    useEffect(() => {
        dispatch(eventActions.fetchEventDetails(eventId))
        dispatch(sessionActions.restoreUser())
        setLoaded(true)
    }, [dispatch, eventId])

    useEffect(() => {
        // if (sessionUser?.id === event?.Organizer?.id)

        console.log(`sessionUser.id`, sessionUser?.user?.id);
        console.log(`event.Organizer.id`, event?.Organizer?.id);
        setIsOrganizer(true)
        console.log(`isOrganizer`, isOrganizer);
    })
    const goBack = () => {
        history.goBack()
    }

    const handleUpdateClick = () => {
        history.push(`/events/${eventId}/edit`)
    }

    const handleDeleteClick = () => {
        AlertConfirm({
            title: 'Are you sure you want to delete this Event?',
            desc: 'You cannot undo this change',
            onOk: () => {
                return dispatch(eventActions.fetchDeleteEvent(eventId))
                    .then(() => history.push(`/events`))
                    .catch(async (res) => {
                        const data = await res.json();
                        if (data && data.errors) console.log(`data`, (data));
                    })
            },
            onCancel: () => {
            }
        });
    }

    const openLocationInNewTab = () => {
        if (event.type === `In Person`) {
            let url = `https://www.google.com/maps/search/?api=1&query=${event.Venue.lat},${event.Venue.lng}`
            const newWindow = window.open(url, '_blank')
            if (newWindow) newWindow.opener = null
        }
    }

    return (
        loaded && event?.previewImage && <div className='mainGroupDetailsDiv'>
            <div className='eventDetailsTopSectionContainer'>
                <div className='eventDetailsTopSection'>
                    <button
                        onClick={goBack}
                        className='backButton'>{`< Events`}</button>
                    <h1>{event?.name}</h1>
                    <h2>Hosted By {event?.Organizer?.firstName} {event?.Organizer?.lastName}</h2>
                </div>
            </div>
            <div className='eventDetailsGreySection'>
                <div className='eventDetailsGreySectionTopHalf'>
                    <img className='eventDetailsImage' src={event?.previewImage} />
                    <div className='eventDetailsRightSection'>
                        <div className='eventDetailsGroupDiv'>
                            <img className='eventDetailsGroupImage' src='https://res.cloudinary.com/dkul3ouvi/image/upload/v1677439417/5498791_i3opa9.jpg' />
                            <div className='eventDetailsGroupDetailsDiv'>
                                <h3>{event?.Group?.name}</h3>
                                <h4>{event?.Group?.private ? `private` : `public`}</h4>
                            </div>
                        </div>
                        <div className='eventDetailsRightOfPictureInfo'>
                            <div className='timeDiv'>
                                <i class="fa-regular fa-clock"></i>
                                <div className='timeSubDiv'>
                                    <div className='startEndDiv'>
                                        <h4>Start:</h4> <h5>{eventDate.toLocaleDateString()} - {eventDate.toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}</h5>
                                    </div>
                                    <div className='startEndDiv'>
                                        <h4>End: </h4> <h5>{eventEndDate.toLocaleDateString()} - {eventEndDate.toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}</h5>
                                    </div>
                                </div>
                            </div>
                            <div className='moneyDiv'>
                                <i class="fa-solid fa-dollar-sign"></i>
                                <h4>{event?.price}</h4>
                            </div>
                            <div className='locationDiv'>
                                <i
                                    onClick={openLocationInNewTab}
                                    class="fa-solid fa-location-dot"></i>
                                <div className='typeDeleteDiv'>
                                    <h4>{event?.type}</h4>

                                </div>

                            </div>
                            {sessionUser?.user.id === event?.Organizer?.id && (
                                <div className='deleteUpdateDiv'>
                                    <button
                                        onClick={handleUpdateClick}
                                        className='sessionUserButtons'
                                    >Update</button>
                                    <button
                                        onClick={handleDeleteClick}
                                        className='sessionUserButtons'>Delete</button>
                                </div>
                            )
                            }
                        </div>
                    </div>
                </div>
                <div className='greySectionBottomHalf'>
                    <h2>Details</h2>
                    <p>{event?.description}</p>
                </div>
            </div>
        </div>
    )

}


export default EventDetailsComponent;
