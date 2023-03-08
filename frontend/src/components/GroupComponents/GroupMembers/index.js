import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import AlertConfirm from 'react-alert-confirm';
import { fetchCurrentUserGroups, fetchUnjoinGroup, fetchJoinGroup, fetchGetGroupMembers, fetchEditGroupMember } from "../../../store/groups";
import './groupMembers.css';


function GroupMembersComponent({ members, groupId }) {
    const dispatch = useDispatch();
    const handleAcceptMemberButton = (status, memberId) => {
        return dispatch(fetchEditGroupMember(groupId, memberId, status))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) console.log(`data`, (data));
            })
    }


    let membersMapped = members.map(member => {
        return (
            <div key={member.id} className='memberContainer'>
                <div className='memberIconDetailsDiv' >
                    <i id='memberIcon' className="fa-regular fa-user "></i>
                    <div>
                        <h4 id='memberName' >{member.firstName} {member.lastName}</h4>
                        <h5 id='memberStatus'>status: {member.Membership?.status}</h5>
                    </div>
                </div>
                <div className='memberButtonsDiv'>

                    {member.Membership.status === 'pending' && <button
                        onClick={() => handleAcceptMemberButton(member.id, member.Membership?.status)}
                        className='groupMemberButton'> Accept Request</button>}
                    {member.Membership.status === 'pending' && <button className='groupMemberButton'> Decline Request</button>}
                    {member.Membership.status === 'active' && <button className='groupMemberButton'>Remove Member</button>}
                    {member.Membership.status === 'active' && <button className='groupMemberButton'>Make Co-host</button>}
                    {member.Membership.status === 'co-host' && <button className='groupMemberButton'>Remove Cohost</button>}
                </div>
            </div>
        )
    })
    return (
        <div className='groupMembersMainDiv'>
            <h2>Group Members</h2>
            {membersMapped}
        </div>

    )

}



export default GroupMembersComponent;
