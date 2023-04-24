import React, { useEffect, useState } from "react";
import { useHistory, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUpcomingEvents } from "../../store/events";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './upcomingEvents.css'

function UpcomingEvents() {
    const dispatch = useDispatch();
    const history = useHistory();

    const upcomingEvents = useSelector(state => {
        return state.events.upcomingEvents
    });

    console.log(`upcomingEvents`, upcomingEvents)

    useEffect(() => {
        dispatch(fetchUpcomingEvents());
    }, [dispatch])

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1,
                },
            },
        ],
    };

    let eventsArr = upcomingEvents.map((event, idx) => {
        let eventDate = new Date(event.startDate);

        return (

            <div onClick={() => history.push(`/events/${event.id}`)} className="upcomingEventContainer">

                <div className="upcomingEventDetailsContainer">
                    <h3 id="upcomingEventStartDate">{eventDate.toLocaleDateString()} {eventDate.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}</h3>
                    <h4 id="upcomingEventName">{event.name}</h4>
                    {event?.Venue?.city && <h3 id="upcomingEventCity">{event.Venue.city}</h3>}
                    <h5 className="upcomingEventType">{event.type}</h5>
                </div>
            </div>
        )
    })

    return (
        <div className="upcomingEventsMainDiv">
            <h2>Upcoming Events</h2>
            <Slider {...settings}>{eventsArr}</Slider>
        </div>
    )

}


export default UpcomingEvents;
