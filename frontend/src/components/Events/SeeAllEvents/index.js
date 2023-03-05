import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEvents, clearCurrentEvent } from '../../../store/events'
import EventsGroupsNav from "../../EventsGroupsNav";
import './SeeAllEvents.css';

function SeeAllEvents() {
    const dispatch = useDispatch();
    const history = useHistory();

    const [searchQueries, setSearchQueries] = useState({})
    const [inPersonQuery, setInPersonQuery] = useState(false);
    console.log(`In person query`, inPersonQuery);
    const events = useSelector(state => {
        return state.events.allEvents
    });

    console.log(`events selector return:`, events)

    useEffect(() => {
        dispatch(fetchAllEvents());
        dispatch(clearCurrentEvent())
    }, [dispatch])

    const handleInPersonClick = (() => {
        if (inPersonQuery === false) {
            setInPersonQuery(true)
        } else {
            setInPersonQuery(false)
        }
        console.log(inPersonQuery);
    })

    useEffect(() => {
        let queryObject = {}
        if (inPersonQuery === true) {
            queryObject.type = 'In Person'
        }
        new URLSearchParams(queryObject).toString();
        console.log(`queryObject`, new URLSearchParams(queryObject).toString());
        dispatch(fetchAllEvents(new URLSearchParams(queryObject).toString()))
    }, [inPersonQuery])
    let eventsArr = events.map((event, idx) => {
        let eventDate = new Date(event.startDate);

        return (
            < div key={idx} className="allEventsContainer" >
                <div onClick={() => history.push(`/events/${event.id}`)} className="eventContainer">
                    <div className="allEventsImgDiv">
                        <img className="allEventsImg" src={event.previewImage}></img>
                    </div>
                    <div className="eventContainerDetails">
                        <h3>{eventDate.toLocaleDateString()} {eventDate.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}</h3>
                        <h4>{event.name}</h4>
                        {event?.Venue?.city && <h3>{event.Venue.city}</h3>}
                    </div>
                </div>
                <p>{event.description}</p>
            </div >)
    })

    return (
        < div className="seeAllGroupsMainDiv" >
            <EventsGroupsNav />
            <div className="seeAllh2">
                <h2 > Events in Meetup </h2>
                <button
                    onClick={handleInPersonClick}
                    className="sessionUserButtons">In Person</button>
            </div>
            {eventsArr}
        </div >

    )
}

export default SeeAllEvents;
