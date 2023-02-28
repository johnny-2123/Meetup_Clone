import React, { useEffect, useRef, useState } from 'react';
import { Redirect, Route, Switch, useLocation, useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import * as groupActions from '../../../store/groups'
import './GroupDetails.css'

function GroupDetailsComponent() {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    let currentPath = location.pathname;
    const group = useSelector(state => state.groups.currentGroup);
    const { groupId } = useParams();
    console.log(`groupId`, groupId)
    console.log(`GroupDetails component group:`, group);
    useEffect(() => {
        dispatch(groupActions.fetchGroupDetails(groupId))

    }, [dispatch])



    return (
        <div className='MainGroupDetailsNav'>
            <div className='SubGroupDetailsNav'>
                <div className='backbuttonDiv'>
                    <button className='backButton'>Back</button>

                </div>
                <div className='groupInfoDiv'>
                    <img src='https://www.advenium.com/wp-content/uploads/2022/03/shutterstock_1464234134-1024x684-1.jpg' />
                    <div className='groupTextTopRightDiv'>
                        <h3>{group.name}</h3>
                        <h4>{group.city}, {group.state}</h4>
                        <h4># Events</h4>
                        <h4>{group.private ? "Private" : "Public"}</h4>
                        <h4>Organized by insert name {group.firstName} {group.lastName}</h4>
                    </div>
                </div>
                <div className='groupTextBottomDiv'>
                    <h4>
                        Organizer
                    </h4>
                </div>

            </div>
        </div>
    )
}

export default GroupDetailsComponent;
