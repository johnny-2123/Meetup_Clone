import React, { useEffect, useState } from "react";
import { useHistory, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUpcomingEvents } from "../../store/events";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./upcomingEvents.css";

function UpcomingEvents() {
  const dispatch = useDispatch();
  const history = useHistory();

  const upcomingEvents = useSelector((state) => {
    return state.events.upcomingEvents;
  });

  useEffect(() => {
    dispatch(fetchUpcomingEvents());
  }, [dispatch]);

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
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  let eventsArr = upcomingEvents.map((event, idx) => {
    let eventDate = new Date(event.startDate);

    return (
      <motion.div
        onClick={() => history.push(`/events/${event.id}`)}
        className="upcomingEventContainer"
        key={idx}
        whileHover={{
          y: -10,
          transition: { duration: 0.2 },
          type: "spring",
          ease: "easeIn",
          stiffness: 300,
          zIndex: 1,
        }}
      >
        <div className="upcomingEventDetailsContainer">
          <img id="upcomingEventImage" src={event.previewImage} />
          <div className="upcomingEventContainerMiddle">
            <div>
              <h3 id="upcomingEventName">{event.name}</h3>
              <p id="upcomingEventDescription">{event.description}</p>
            </div>
            <h3>{event.Group?.private ? "private" : "public"}</h3>
          </div>
          <div className="upcomingEventContainerFooter">
            <div>
              <h4 id="upcomingEventStartDate" className="eventDate">
                {eventDate.toLocaleDateString()}
              </h4>
            </div>
            <div>
              {event?.Venue?.city && (
                <h4 id="upcomingEventCity">{event.Venue.city}</h4>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  });

  return (
    <div className="upcomingEventsMainDiv">
      <h2>Upcoming Events</h2>
      <Slider {...settings}>{eventsArr}</Slider>
    </div>
  );
}

export default UpcomingEvents;
