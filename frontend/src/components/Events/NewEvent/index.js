import React, { useEffect, useState } from 'react';
import * as eventActions from '../../../store/events';
import * as groupActions from '../../../store/groups';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import './NewEventForm.css';

function NewEventForm() {
    const dispatch = useDispatch();
    const { groupId } = useParams()
    const history = useHistory();
    const sessionUser = useSelector(state => state.session?.user);
    const currentGroup = useSelector(state => state.groups.currentGroup);

    const [Name, setName] = useState('');
    const [Type, setType] = useState('');
    const [Description, setDescription] = useState('');
    const [Price, setPrice] = useState(0);
    const [capacity, setCapacity] = useState(10);
    const [StartDate, setStartDate] = useState('');
    const [EndDate, setEndDate] = useState('');
    const [PreviewImage, setPreviewImage] = useState('');
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        dispatch(groupActions.fetchGroupDetails(groupId));

    }, [groupId])

    const handleSubmit = (e) => {
        e.preventDefault();
        const event = { organizerId: sessionUser?.id, groupId: currentGroup?.id, name: Name, type: Type, capacity: capacity, price: Price, startDate: StartDate, endDate: EndDate, previewImage: PreviewImage, description: Description };

        return dispatch(eventActions.fetchCreateEvent(currentGroup.id, event))
            .then((res) => history.push(`/events/${res.id}`))
            .catch(async (res) => {
                const data = await res.json();

                if (data && data.errors) setErrors(data.errors);
            })
    }

    return (
        <div id='newEventMainDiv'>
            <div className='newEventSubDiv'>

                <h3 id='newEventHeader'>Create a new event</h3>
                <form className='newEventForm' onSubmit={handleSubmit}>
                    <div className='eventFormSubDiv'>
                        <h4 id='newEventName'>What is the name of your event?</h4>
                        <input
                            type={`text`}
                            value={Name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder='event name'
                            name="name" />
                    </div>
                    <div>
                        <h4>Is this an in person or online event?</h4>
                        <select
                            name='type'
                            value={Type}
                            onChange={(e) => setType(e.target.value)}
                            required
                        >
                            <option value="">(select one)</option>
                            <option value="In Person">In Person</option>
                            <option value="Online">Online</option>
                        </select>
                    </div>
                    <div>
                        <h4>What is the price for your event?</h4>
                        <div id='dollarDiv'>
                            <span className='dollarSpan' >$</span>
                            <input
                                className='currency'
                                type="number"
                                min="0"
                                max="999999"
                                id="priceNumber"
                                value={Price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <h4>What is the capacity for your event?</h4>
                        <input
                            type="number"
                            min="0"
                            id='capacityNumber'
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                        />
                    </div>
                    <div>
                        <h4>When does your event start?</h4>
                        <input type="datetime-local"
                            name='startDate'
                            value={StartDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <h4>When does your event end?</h4>
                        <input type="datetime-local"
                            name='endDate'
                            value={EndDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <h4>Please add an image url if you want to change your event's image:</h4>
                        <input type="text"
                            name='previewImage'
                            value={PreviewImage}
                            onChange={(e) => setPreviewImage(e.target.value)}
                        />
                    </div>
                    <div>
                        <h4>Now describe what your event</h4>
                        <h4>People will see this when we promote your event, but you'll be able to add to it later, too.
                        </h4>
                        <ol>
                            <li>What's the purpose of the event?</li>
                            <li>Who should attend?</li>
                            <li>What will you do at your event?</li>
                        </ol>
                        <textarea type="text"
                            name='description'
                            value={Description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    {errors && <ul className='errors'>
                        {errors.map((error, idx) => <li key={idx
                        }>{error}</li>)}
                    </ul>}
                    <button
                        type='submit' className='newEventSubmitButtom'>Create  Event</button>
                </form>
            </div>
        </div>

    )

}


export default NewEventForm
