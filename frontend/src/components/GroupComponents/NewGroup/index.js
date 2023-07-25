import React, { useEffect, useState } from 'react';
import * as groupActions from '../../../store/groups';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getKey } from '../../../store/maps';
import GoogleAutocomplete from 'react-google-autocomplete';
import './NewGroupForm.css'

function NewGroupForm() {
    const key = useSelector((state) => state.maps.key);
    const dispatch = useDispatch()

    useEffect(() => {
        if (!key) {
            dispatch(getKey());
        }
    }, [dispatch, key]);


    const history = useHistory();

    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [type, setType] = useState('');
    const [privacy, setPrivacy] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [errors, setErrors] = useState([]);
    const [disableSubmitButton, setDisableSubmitButton] = useState(false)

    const submitButtonClass = disableSubmitButton ? 'newGroupSubmitButtomDisabled' : 'newGroupSubmitButtom';


    useEffect(() => {
        let errors = [];
        if (!name) {
            errors.push("Name must be 60 characters or less")
        };

        if (!about) {

            errors.push("About must be 50 characters or more")
        };

        if (!type) {
            errors.push("Type must be Online or In person")
        };

        if (!privacy) {
            errors.push("Private must be a boolean")
        };

        if (!city) {
            errors.push("City is required")
        };

        if (!state) {
            errors.push("State is required")
        };
        if (!imageUrl) {
            errors.push(`add an image url`)
        }
        if (errors.length > 0) {
            setDisableSubmitButton(true)
        } else {
            setDisableSubmitButton(false)
        }
    }, [name, about, type, privacy, city, state, imageUrl])

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);


        const group = { city, state, name, about, type, private: privacy, previewImage: imageUrl }

        return dispatch(groupActions.fetchCreateGroup(group))
            .then((res) => history.push(`/groups/${res.id}`))
            .catch(async (res) => {
                const data = await res.json();

                if (data && data.errors) setErrors(data.errors);
            })
    };


    return (
        <div id='newGroupMainDiv' >
            <div className='newGroupSubDiv'>
                <h3 id='newGroupHeader'>Become An Organizer</h3>
                <h3>We'll walk you through a few steps to build your local community</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <h3>First, set your group's location.</h3>
                        <h5>Meetup groups meet locally, in person and online. <br></br>We'll connect you with people in your area, and more can join you online.</h5>
                        {key &&
                            <GoogleAutocomplete
                                apiKey={key}
                                onPlaceSelected={(place) =>
                                    setCity(place.address_components[0].long_name)
                                }
                                types={['(cities)']}
                                required
                                placeholder="City"
                                name="city"
                            />
                        }
                        <input
                            type={`text`}
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            required
                            placeholder="state" name="state"></input>
                    </div>
                    <div>
                        <h3>What will your group's name be?</h3>
                        <h5>Choose a name that will give people a clear idea of what the group is about. <br></br>Feel free to get creative! You can edit this later if you change your mind.

                        </h5>
                        <input
                            type={`text`}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="What is your Group Name?" name="groupName"></input>
                    </div>
                    <div>
                        <h3>Now describe what your group will be about</h3>
                        <h5>People will see this when we promote your group, but you'll be able to add to it later, too.
                        </h5>
                        <ol>
                            <li>What's the purpose of the group?</li>
                            <li>Who should join?</li>
                            <li>What will you do at your events?</li>
                        </ol>
                        <textarea
                            type={`text`}
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            required
                            placeholder="Please write at least 30 characters" name="groupName"></textarea>
                    </div>
                    <div id='finalStepsDiv'>
                        <h3>Final steps...</h3>
                        <div>
                            <h5 >Is this an in person or online group?</h5>
                            <select
                                name='privacy'
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                required
                            >
                                <option value="">(select one)</option>
                                <option value="In person">In person</option>
                                <option value="Online">Online</option>

                            </select>
                        </div>
                        <div>
                            <h5>Is this group private or public?</h5>
                            <select
                                name='privacy'
                                value={privacy}
                                onChange={(e) => setPrivacy(e.target.value)}
                                required
                            >
                                <option value="">(select one)</option>
                                <option value={true}>private</option>
                                <option value={false}>public</option>
                            </select>
                        </div>
                        <h5>Please add an image url for your group below</h5>
                        <input
                            type={`text`}
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            required
                            name='imageUrl'
                            placeholder="image url"></input>
                    </div>
                    {errors && <ul className='errors'>
                        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                    </ul>}
                    <button
                        type='submit' className={submitButtonClass}>Create New Group</button>
                </form>
            </div>
        </div >
    )
}

export default NewGroupForm
