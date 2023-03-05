import React, { useEffect, useState } from 'react';
import * as eventActions from '../../../store/events';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import './NewEventForm.css'
function NewEventForm() {
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionUser = useSelector(state => state.session?.user);

    const [updatedName, setUpdatedName] = useState();
    const [updatedType, setUpdatedType] = useState();
    const [updatedDescription, setUpdatedDescription] = useState();
    const [updatedPrice, setUpdatedPrice] = useState();
    const [updatedCapacity, setUpdatedCapacity] = useState();
    const [updatedStartDate, setUpdatedStartDate] = useState();

    const [updatedEndDate, setUpdatedEndDate] = useState();
    const [updatedPreviewImage, setUpdatedPreviewImage] = useState('');
    const [errors, setErrors] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const goBack = () => {
        history.goBack();
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        const event = { organizerId: sessionUser.id, name: updatedName, type: updatedType, price: updatedPrice, startDate: updatedStartDate, endDate: updatedEndDate, previewImage: updatedPreviewImage };
        console.log(`event sent to dispatchUpdateEvent`, event);

        return
    }

    return (
        <div>
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
                        type='submit' className='submitButton'>Update Group</button>
                </form>
            </div>
        </div>

    )

}


export default NewEventForm
