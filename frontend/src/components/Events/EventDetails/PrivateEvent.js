import React from 'react';
import { useHistory, } from "react-router-dom";
import './PrivateEvent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'


function PrivateEventComponent({ event }) {

    const history = useHistory();

    console.log(`*********************event:`, event)

    const handleGroupDivClick = () => {
        history.push(`/groups/${event?.Group?.id}`)

    }


    return (
        <div>
            {event.Group?.previewImage && event?.previewImage == undefined &&
                <div className='detailsHiddenMainDiv'>
                    <div className='detailsHiddenSubDiv' >
                        <h1>{event?.name}</h1>

                        <div

                            onClick={handleGroupDivClick}
                            className='eventDetailsHiddenGroupDiv'>
                            <h2>Join Group To See Event Details</h2>
                            <img className='eventDetailsHiddenGroupImage' src={event?.Group?.previewImage} />
                            <div className='eventDetailsHiddenGroupDetailsDiv'>
                                <h3>{event?.Group?.name}</h3>

                            </div>
                        </div>
                        <div className="lock">
                            <FontAwesomeIcon icon={faLock} size='6x' />
                        </div>
                    </div>
                </div>
            }
        </div>
    )

}


export default PrivateEventComponent;
