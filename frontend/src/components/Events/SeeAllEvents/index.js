import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEvents } from '../../../store/events'
import EventsGroupsNav from "../../EventsGroupsNav";
import './SeeAllEvents.css';

function SeeAllEvents() {
    const dispatch = useDispatch();
    const history = useHistory();

    const events = useSelector(state => {
        return state.events.allEvents
    });

    console.log(`events selector return:`, events)

    useEffect(() => {
        dispatch(fetchAllEvents());
    }, [dispatch])


    let eventsArr = events.map((event, idx) => {
        return (
            < div key={idx} className="allGroupsContainer" >
                <div className="groupContainer">
                    <img className="allGroupsImg" src={event.previewImage}></img>
                    <div className="groupContainerDetails">
                        <h3>{event.startDate}</h3>
                        <h4>{event.name}</h4>
                        <h3>{event.Venue.city}</h3>

                    </div>
                </div>

            </div >)
    })

    return (
        < div className="seeAllGroupsMainDiv" >
            <EventsGroupsNav />
            <div className="seeAllh2">
                <h2 > Events in Meetup </h2>
            </div>
            {eventsArr}
        </div >

    )
}

export default SeeAllEvents;
