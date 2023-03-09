import React, { useEffect, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AlertConfirm from 'react-alert-confirm';
import { fetchEditGroupMember, fetchDeleteGroupMember } from "../../../store/groups";
import './groupMembers.css';


function GroupMembersComponent({ groupId, userIsOrganizer, organizerId }) {
    const dispatch = useDispatch();
    const members = useSelector(state => state.groups?.groupMembers);
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {

    }, [members])

    const membersArray = Object.values(members);
    console.log(`membersArray`, membersArray)

    console.log(`GroupMembersGroupId: ${groupId}`);



    const handleRemoveMemberButton = (memberId) => {
        return dispatch(fetchDeleteGroupMember(groupId, memberId))
            .then(() => forceUpdate())
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) console.log(`data`, (data));
            })
    }
    const handleEditMemberButton = (status, memberId, member) => {

        console.log(`status: ${status}`);
        console.log(`memberId: ${memberId}`);
        console.log(`groupId: ${groupId}`);
        return dispatch(fetchEditGroupMember(groupId, memberId, status))
            .then(() => forceUpdate())
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) console.log(`data`, (data));
            })
    }

    let membersMapped = membersArray.map(member => {
        let memberIconId = member.Membership?.status === 'pending' ? 'memberIconPending' : 'memberIcon'
        return (
            <div key={member.id} className='memberContainer'>
                <div className='memberIconDetailsDiv' >
                    <i id={memberIconId} className="fa-regular fa-user "></i>
                    <div>
                        <h4 id='memberName' >{member.firstName} {member.lastName}</h4>
                        {userIsOrganizer && <h5 id='memberStatus'>status: {member.Membership?.status}</h5>}
                    </div>
                </div>
                {userIsOrganizer && (member.id !== organizerId) && < div className='memberButtonsDiv'>

                    {member.Membership.status === 'pending' && <button
                        onClick={() => handleEditMemberButton('active', member.id, member)}
                        className='groupMemberButton'> Accept Request</button>}
                    {member.Membership.status === 'pending' && <button
                        onClick={() => handleRemoveMemberButton(member?.id)}
                        className='groupMemberButton'> Decline Request</button>}
                    {member.Membership.status === 'active' && <button
                        onClick={() => handleRemoveMemberButton(member?.id)}
                        className='groupMemberButton'>Remove Member</button>}
                    {member.Membership.status === 'active' && <button
                        onClick={() => handleEditMemberButton('co-host', member.id, member)}
                        className='groupMemberButton'>Make Co-host</button>}
                    {member.Membership.status === 'co-host' && <button
                        onClick={() => handleEditMemberButton('active', member.id, member)} className='groupMemberButton'>Remove Cohost</button>}
                </div>}
            </div >
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
