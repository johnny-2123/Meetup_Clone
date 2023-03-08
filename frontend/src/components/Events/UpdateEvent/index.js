import React, { useEffect, useState } from 'react';
import * as eventActions from '../../../store/events';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import './UpdateEvent.css';

function UpdateEventPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const event = (useSelector(state => state.events.currentEvent));
    let { eventId } = useParams();
    let { name, type, description, price, capacity, startDate, endDate, previewImage } = event;
    startDate = startDate?.slice(0, startDate.length - 1);
    endDate = endDate?.slice(0, endDate.length - 1);

    const [updatedName, setUpdatedName] = useState(name);
    const [updatedType, setUpdatedType] = useState(type);
    const [updatedDescription, setUpdatedDescription] = useState(description);
    const [updatedPrice, setUpdatedPrice] = useState(price);
    const [updatedCapacity, setUpdatedCapacity] = useState(capacity);
    const [updatedStartDate, setUpdatedStartDate] = useState(startDate);

    const [updatedEndDate, setUpdatedEndDate] = useState(endDate);
    const [updatedPreviewImage, setUpdatedPreviewImage] = useState('');
    const [errors, setErrors] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const goBack = () => {
        history.goBack();
    };

    useEffect(() => {
        dispatch(eventActions.fetchEventDetails(eventId));
        setLoaded(true);
    }, [dispatch, eventId])

    const handleSubmit = (e) => {
        e.preventDefault();
        const event = { name: updatedName, type: updatedType, price: updatedPrice, startDate: updatedStartDate, endDate: updatedEndDate, previewImage: updatedPreviewImage, description: updatedDescription };

        return dispatch(eventActions.fetchUpdateEvent(eventId, event))
            .then(() => goBack())
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })
    }

    return (
        loaded && event?.name && <div id='updateEventMainDiv'>
            <div className='newEventSubDiv'>
                <h3>Update your event</h3>
                <form className='newEventForm' onSubmit={handleSubmit}>
                    <div className='eventFormSubDiv'>
                        <h4>What is the name of your event?</h4>
                        <input
                            type={`text`}
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                            required
                            name="name" />
                    </div>
                    <div>
                        <h4>Is this an in person or online event?</h4>
                        <select
                            name='type'
                            value={updatedType}
                            onChange={(e) => setUpdatedType(e.target.value)}
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
                                value={updatedPrice}
                                onChange={(e) => setUpdatedPrice(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <h4>When does your event start?</h4>
                        <input type="datetime-local"
                            name='startDate'
                            value={updatedStartDate}
                            onChange={(e) => setUpdatedStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <h4>When does your event end?</h4>
                        <input type="datetime-local"
                            name='endDate'
                            value={updatedEndDate}
                            onChange={(e) => setUpdatedEndDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <h4>Please add an image url if you want to change your event's image:</h4>
                        <input type="text"
                            name='previewImage'
                            value={updatedPreviewImage}
                            onChange={(e) => setUpdatedPreviewImage(e.target.value)}
                        />
                    </div>
                    <div>
                        <h4>Please describe your event:</h4>
                        <textarea type="text"
                            name='description'
                            value={updatedDescription}
                            onChange={(e) => setUpdatedDescription(e.target.value)}
                        />
                    </div>
                    {errors && <ul className='errors'>
                        {errors.map((error, idx) => <li key={idx
                        }>{error}</li>)}
                    </ul>}
                    <button
                        type='submit' className='newEventSubmitButtom'>Update Event</button>
                </form>
            </div>
        </div>

    )

}


export default UpdateEventPage
