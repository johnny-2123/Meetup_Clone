
import React, { useEffect, useState } from 'react';
import { NavLink, useHistory, useParams } from "react-router-dom";


function GroupEventsComponent({ events }) {
    const history = useHistory();

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
        <>
            <h3 className='upcomingEvents' >Upcoming Events</h3>
            {UpcomingGroupEventsMapped.length > 0 && UpcomingGroupEventsMapped}
            {UpcomingGroupEventsMapped.length === 0 && <h4 id='upcomingEvents'>No upcoming events</h4>}
            <h3>Past Events</h3>
            {pastGroupEventsMapped.length > 0 && pastGroupEventsMapped}
            {(pastGroupEventsMapped === 'undefined' || pastGroupEventsMapped.length === 0) && <h4 id='pastEvents'>No Past Events</h4>}
        </>
    )

}



export default GroupEventsComponent;
