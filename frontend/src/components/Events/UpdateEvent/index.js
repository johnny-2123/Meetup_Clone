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
    console.log(`startdate`, startDate)

    const [updatedName, setUpdatedName] = useState(name);
    const [updatedType, setUpdatedType] = useState(type);
    const [updatedDescription, setUpdatedDescription] = useState(description);
    const [updatedPrice, setUpdatedPrice] = useState(price);
    const [updatedCapacity, setUpdatedCapacity] = useState(capacity);
    const [updatedStartDate, setUpdatedStartDate] = useState(startDate);

    // console.log(`updatedStartDate,`, updatedStartDate);
    // console.log(`startDate typeof`, typeof (startDate));
    // console.log(`updatedStart Typof`, typeof (updatedStartDate));

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
        const event = { name: updatedName, type: updatedType, price: updatedPrice, startDate: updatedStartDate, endDate: updatedEndDate, previewImage: updatedPreviewImage };
        console.log(`event sent to dispatchUpdateEvent`, event);

        return dispatch(eventActions.fetchUpdateEvent(eventId, event))
            .then((res) => console.log(`return event from updateEvent page`, res))
            .then(() => goBack())
            .catch(async (res) => {
                const data = await res.json();
                console.log(`eventUpdate fetch catch res`, data);
                if (data && data.errors) setErrors(data.errors);
            })
    }

    return (
        loaded && event?.name && <div id='updateEventMainDiv'>
            <div>
                {errors && <ul className='errors'>
                    {errors.map((error, idx) => <li key={idx
                    }>{error}</li>)}
                </ul>}
                <h3>Update your event</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <h4>What is the name of your event?</h4>
                        <input
                            type={`text`}
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                            required
                            name="name" />
                    </div>
                    <div>
                        <h3>Is this an in person or online event?</h3>
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
                        <h3>What is the price for your event?</h3>
                        $ <input
                            type="number"
                            min="0"
                            id="inputNumber"
                            value={updatedPrice}
                            onChange={(e) => setUpdatedPrice(e.target.value)}
                        />

                    </div>
                    <div>
                        <h3>When does your event start?</h3>
                        <input type="datetime-local"
                            name='startDate'
                            value={updatedStartDate}
                            onChange={(e) => setUpdatedStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <h3>When does your event end?</h3>
                        <input type="datetime-local"
                            name='endDate'
                            value={updatedEndDate}
                            onChange={(e) => setUpdatedEndDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <h3>Please add an image url if you want to change your event's image:</h3>
                        <input type="text"
                            name='previewImage'
                            value={updatedPreviewImage}
                            onChange={(e) => setUpdatedPreviewImage(e.target.value)}
                        />
                    </div>
                    <div>
                        <h3>Please describe your event:</h3>
                        <textarea type="text"
                            name='description'
                            value={updatedDescription}
                            onChange={(e) => setUpdatedDescription(e.target.value)}
                        />
                    </div>
                    <button
                        type='submit' className='submitButton'>Update Event</button>
                </form>
            </div>
        </div>

    )

}


export default UpdateEventPage
