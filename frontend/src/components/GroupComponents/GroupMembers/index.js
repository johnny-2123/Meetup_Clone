import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import AlertConfirm from 'react-alert-confirm';
import * as groupActions from '../../../store/groups';
import { fetchCurrentUserGroups, fetchUnjoinGroup, fetchJoinGroup, fetchGetGroupMembers } from "../../../store/groups";
import './groupMembers.css';


function GroupMembersComponent() {
    console.log(`+++++ ++++++++++++++++++++++++++++++++++++++++++++++++`);
    const history = useHistory();
    const dispatch = useDispatch();


    const { groupId } = useParams();
    const sessionUser = useSelector(state => state.session?.user);
    const members = useSelector(state => state.groups?.groupMembers);
    console.log(`members`, members);



    return (
        <div className='groupMembersMainDiv'>
            <h2>Group Members</h2>

        </div>

    )

}



export default GroupMembersComponent;
