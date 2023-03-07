import React, { useEffect, useState } from "react";
import { useHistory, NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEvents, clearCurrentEvent } from '../../../store/events'
import EventsGroupsNav from "../../EventsGroupsNav";
import './SeeAllEvents.css';

function SeeAllEvents() {
    const dispatch = useDispatch();
    const history = useHistory();
    let location = useLocation();
    const [searchQueries, setSearchQueries] = useState({})
    const [inPersonClicked, setInPersonClicked] = useState(false);

    const [inPersonQuery, setInPersonQuery] = useState(false);

    let inPersonClassName = (inPersonClicked ? " eventQueryButtonClick" : "eventQueryButtonNotClicked");

    const events = useSelector(state => {
        return state.events.allEvents
    });

    useEffect(() => {
        dispatch(fetchAllEvents());
        dispatch(clearCurrentEvent())
    }, [dispatch])

    const handleInPersonClick = (() => {
        console.log(`inPersonClicked`, inPersonClicked);
        console.log(`inPersonClassName`, inPersonClassName);
        if (inPersonQuery === false) {
            setInPersonClicked(true)
            setInPersonQuery(true)
        } else {
            setInPersonClicked(false)
            setInPersonQuery(false)
        }

    })

    useEffect(() => {
        let queryObject = {}
        if (inPersonQuery === true) {
            queryObject.type = 'In Person'
        }
        new URLSearchParams(queryObject).toString();
        dispatch(fetchAllEvents(new URLSearchParams(queryObject).toString()))
    }, [inPersonQuery])
    let eventsArr = events.map((event, idx) => {
        let eventDate = new Date(event.startDate);

        return (
            < div key={idx} className="allEventsContainer" >
                <div onClick={() => history.push(`/events/${event.id}`)} className="groupContainer">

                    <img className="allGroupsImg" src={event.previewImage}></img>

                    <div className="groupContainerDetails">
                        <h3 id="allEventsEventDate">{eventDate.toLocaleDateString()} {eventDate.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}</h3>
                        <h4 id="allEventsName">{event.name}</h4>
                        {event?.Venue?.city && <h3 id="allEventsCity">{event.Venue.city}</h3>}
                    </div>
                </div>
                <p className="pDiv">{event.description}</p>
            </div >)
    })

    return (
        < div className="seeAllGroupsMainDiv" >
            <ul className='EventsGroupsNav'>
                <li>
                    <NavLink id="underlineEvents" className={`EventsGroupsLinks`} to='/events'>Events</NavLink>
                </li>
                <li><NavLink className={`EventsGroupsLinks`} to='/groups'>Groups</NavLink>
                </li>
            </ul>
            <div className="belowEventsGroupsNav">
                <div className="allEventsButtons_subHeaderDiv">
                    <h2 className="EventsInMeetup"> Events in Meetup </h2>

                    <button
                        onClick={handleInPersonClick}
                        className={inPersonClassName}>In Person</button>
                </div>
                {eventsArr}
            </div>

        </div >

    )
}

export default SeeAllEvents;
