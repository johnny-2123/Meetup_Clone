import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./CurrentUserGroups.css";
import { fetchCurrentUserGroups } from "../../../store/groups";
