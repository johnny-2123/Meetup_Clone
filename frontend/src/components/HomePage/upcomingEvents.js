import React, { useEffect, useState } from "react";
import { useHistory, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEvents, clearCurrentEvent } from '../../../store/events'

function UpcomingEvents() {
    const dispatch = useDispatch();

}
