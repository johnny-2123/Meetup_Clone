import React, { useEffect, useState } from "react";
import { useHistory, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEvents, clearCurrentEvent } from '../../../store/events'
import './SeeAllEvents.css';

function SeeAllEvents() {
    const dispatch = useDispatch();
    const history = useHistory();

    const [inPersonQuery, setInPersonQuery] = useState(false);
    const [onlineQuery, setOnlineQuery] = useState(false);
    const [futureOnlyQuery, setFutureOnlyQuery] = useState(true);
    const [earliestFirst, setEarliestFirst] = useState(false);
    const [latestFirst, setLatestFirst] = useState(false);

    let latestClassName = latestFirst ? 'timeEventQueryButtonClick' :
        'timeEventQueryButtonNotClicked';

    let earliestClassName = earliestFirst ? 'timeEventQueryButtonClick' : 'timeEventQueryButtonNotClicked';

    let onlineClassName = onlineQuery ? "eventQueryButtonClick" : "eventQueryButtonNotClicked";

    let inPersonClassName = inPersonQuery ? " eventQueryButtonClick" : "eventQueryButtonNotClicked";

    let futureOnlyClassName = futureOnlyQuery ? 'timeEventQueryButtonClick' : 'timeEventQueryButtonNotClicked';

    const events = useSelector(state => {
        return state.events.allEvents
    });

    useEffect(() => {
        dispatch(fetchAllEvents());
        dispatch(clearCurrentEvent())
    }, [dispatch])


    const handleEarliestClicked = () => {

        if (!earliestFirst) {
            setEarliestFirst(true)
            setLatestFirst(false);
        } else {
            setEarliestFirst(false)
        }
    }

    const handleLatestClicked = () => {
        if (!latestFirst) {
            setLatestFirst(true)
            setEarliestFirst(false);
        }
        else {
            setLatestFirst(false)
        }
    }

    const handleFutureOnlyClicked = () => {

        if (!futureOnlyQuery) {
            setFutureOnlyQuery(true)
        } else {
            setFutureOnlyQuery(false)
        }

    }

    const handleInPersonClick = (() => {
        if (inPersonQuery === false) {
            setInPersonQuery(true)
            setOnlineQuery(false)

        } else {
            setInPersonQuery(false)
        }

    })

    const handleOnlineClick = (() => {
        if (onlineQuery === false) {
            setOnlineQuery(true)
            setInPersonQuery(false)
        }
        else {
            setOnlineQuery(false)
        }
    })

    useEffect(() => {
        let queryObject = {}
        if (inPersonQuery === true) {
            queryObject.type = 'In Person'
        }

        if (onlineQuery === true) {
            queryObject.type = 'Online'
        }

        if (futureOnlyQuery === true) {
            queryObject.futureOnlyQuery = true
        }

        if (latestFirst) {
            queryObject.latestFirst = true
        }

        if (earliestFirst) {
            queryObject.earliestFirst = true
        }

        new URLSearchParams(queryObject).toString();
        dispatch(fetchAllEvents(new URLSearchParams(queryObject).toString()))
    }, [inPersonQuery, onlineQuery, futureOnlyQuery, earliestFirst, latestFirst]);

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
                        <h5 className="seeAllEventsType">{event.type}</h5>
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
                    <button
                        onClick={handleOnlineClick}
                        className={onlineClassName}>Online</button>
                    <button
                        onClick={handleFutureOnlyClicked}
                        className={futureOnlyClassName}>Future Only</button>
                    {/* <button
                        onClick={handleLatestClicked}
                        className={latestClassName}>Latest First</button> */}
                    {/* <button
                        onClick={handleEarliestClicked}
                        className={earliestClassName}>Latest First</button> */}
                </div>
                {eventsArr}
            </div>

        </div >

    )
}

export default SeeAllEvents;
