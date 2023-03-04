import React, { useEffect, useState } from 'react';
import * as groupActions from '../../../store/groups';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import './UpdateGroup.css'

function UpdateGroupPage() {

    const dispatch = useDispatch();
    const history = useHistory();
    const group = useSelector(state => state.groups.currentGroup);
    let { groupId } = useParams();
    let { city, state, name, type, about } = group
    let privacy = group.private;


    const [updatedCity, setUpdatedCity] = useState(city);
    const [updatedState, setUpdatedState] = useState(state);
    const [updatedName, setUpdatedName] = useState(name);
    const [updatedAbout, setUpdatedAbout] = useState(about);
    const [updatedType, setUpdatedType] = useState(type);
    const [updatedPrivacy, setUpdatedPrivacy] = useState(privacy);
    const [updatedImageUrl, setUpdatedImageUrl] = useState();
    const [errors, setErrors] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const goBack = () => {
        history.goBack()
    }

    useEffect(() => {
        dispatch(groupActions.fetchGroupDetails(groupId))
        setLoaded(true)

    }, [dispatch, groupId])

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        const group = { city: updatedCity, state: updatedState, name: updatedName, about: updatedAbout, type: updatedType, private: updatedPrivacy, previewImage: updatedImageUrl }

        return dispatch(groupActions.fetchUpdateGroup(groupId, group))
            .then(() => goBack())
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            });
    };

    return (
        loaded && <div>
            <div>
                {errors && <ul className='errors'>
                    {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                </ul>}
                <h3>Update Your Groups Information</h3>
                <h4>We'll walk you through a few steps to build your local community</h4>
                <form onSubmit={handleSubmit}>
                    <div>
                        <h3>First, set your group's location.</h3>
                        <h4>Meetup groups meet locally, in person and online. <br></br>We'll connect you with people in your area, and more can join you online.</h4>
                        <input
                            type={`text`}
                            value={updatedCity}
                            onChange={(e) => setUpdatedCity(e.target.value)}
                            required
                            placeholder="city" name="city"></input>
                        <input
                            type={`text`}
                            value={updatedState}
                            onChange={(e) => setUpdatedState(e.target.value)}
                            required
                            placeholder="state" name="state"></input>
                    </div>
                    <div>
                        <h3>What will your group's name be?</h3>
                        <h4>Choose a name that will give people a clear idea of what the group is about. <br></br>Feel free to get creative! You can edit this later if you change your mind.

                        </h4>
                        <input
                            type={`text`}
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                            required
                            placeholder="What is your Group Name?" name="groupName"></input>
                    </div>
                    <div>
                        <h3>Now describe what your group will be about</h3>
                        <h4>People will see this when we promote your group, but you'll be able to add to it later, too.
                        </h4>
                        <ol>
                            <li>What's the purpose of the group?</li>
                            <li>Who should join?</li>
                            <li>What will you do at your events?</li>
                        </ol>
                        <textarea
                            type={`text`}
                            value={updatedAbout}
                            onChange={(e) => setUpdatedAbout(e.target.value)}
                            required
                            placeholder="Please write at least 30 characters" name="groupName"></textarea>
                    </div>
                    <div>
                        <h3>Final steps...</h3>
                        <div>
                            <h3 >Is this an in person or online group?</h3>
                            <select
                                name='type'
                                value={updatedType}
                                onChange={(e) => setUpdatedType(e.target.value)}
                                required
                            >
                                <option value="">(select one)</option>
                                <option value="In person">In Person</option>
                                <option value="Online">Online</option>

                            </select>
                        </div>
                        <div>
                            <h3>Is this group private or public?</h3>
                            <select
                                name='privacy'
                                value={updatedPrivacy}
                                onChange={(e) => setUpdatedPrivacy(e.target.value)}
                                required
                            >
                                <option value="">(select one)</option>
                                <option value={true}>private</option>
                                <option value={false}>public</option>
                            </select>
                        </div>
                        <h3>Add an image url below if you'd like to change your groups image</h3>
                        <input
                            type={`text`}
                            value={updatedImageUrl}
                            onChange={(e) => setUpdatedImageUrl(e.target.value)}
                            name='imageUrl'
                            placeholder="image url"></input>
                    </div>
                    <button
                        type='submit' className='submitButton'>Update Group</button>
                </form>
            </div>
        </div>
    )
}

export default UpdateGroupPage
