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

    const event = useSelector(state => state.events.currentEvent);
    const sessionUser = useSelector(state => state.session.user);

    const [loaded, setLoaded] = useState(false);


    useEffect(() => {
        dispatch(eventActions.fetchEventDetails(eventId))
            .then((res) => console.log(`dipatchFetchEventDetails component res:`, res))
            .catch((res) => console.log(`dispatchEventdetails catch response component:`, res));
        dispatch(sessionActions.restoreUser())
        setLoaded(true)
    }, [dispatch, eventId])


    return (
        loaded && <div className='mainGroupDetailsDiv'>
            <div className='eventDetailsTopSectionContainer'>
                <div className='eventDetailsTopSection'>
                    <button className='backButton'>{`< Events`}</button>
                    <h1>{event?.name}</h1>
                    <h2>Hosted By {event?.Organizer?.firstName} {event?.Organizer?.lastName}</h2>
                </div>
            </div>
            <div className='eventDetailsGreySection'>
                <div className='eventDetailsMiddleSection'>
                    <div className='eventDetailsGreySectionTopHalf'>
                        <img className='eventDetailsImage' src='https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8ZXZlbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60' />
                        <div>
                            <div className='eventDetailsGroupDiv'>
                                <img className='eventDetailsGroupImage' src='https://res.cloudinary.com/dkul3ouvi/image/upload/v1677439417/5498791_i3opa9.jpg' />
                                <div>
                                    <h3>{event?.Group?.name}</h3>
                                    <h4>{event.Group?.private ? `private` : `public`}</h4>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <i class="fa-regular fa-clock"></i>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )

}


export default EventDetailsComponent;
