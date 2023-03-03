import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import OpenModalButton from '../OpenModalButton';

import './HomePage.css'

const HomePage = () => {
    const sessionUser = useSelector(state => state.session?.user);

    return (
        < div className='grid-containerHome' >
            <div className='grid item grid-item-1'>
                <div >
                    <h1>The people platform - <br></br> Where interests become friendships</h1>
                    <p>Lorem ipsum dolor sit amet. Et accusamus voluptatem et earum amet qui aspernatur molestias aut illo soluta ut veritatis sapiente. Et commodi debitis aut eius dolor cum laborum molestiae est maiores.</p>
                </div>
                <img className='homePageImage' src='https://res.cloudinary.com/dkul3ouvi/image/upload/v1677379615/vecteezy_back-view-of-man-and-woman-friends-standing-together_5638987_xppydz.jpg' alt='Friends Vector by Vecteezy' />
            </div>
            <div className='grid-item grid-item-2'>
                <h2>How Meetup works</h2>
                <p>Lorem ipsum dolor sit amet. Et accusamus voluptatem et earum amet qui </p>
            </div>
            <div className='grid-item grid-item-3'>
                <div>
                    <i class="fa-solid fa-handshake"></i>
                    <NavLink className={`homePageSection3Links`} to='/groups'>See All Groups</NavLink>
                </div>
                <div>
                    <i class="fa-solid fa-ticket"></i>
                    <NavLink className={`homePageSection3Links`} to='/events'>Find an event</NavLink>
                </div>
                <div>
                    <i class="fa-solid fa-people-group"></i>
                    <NavLink className={`homePageSection3Links`} to='/groups/new'>start a group</NavLink>
                </div>
            </div>
            <div className='grid-item grid-item-4'>
                <NavLink className={`joinButton`} to='/signup'>Join Meetup</NavLink>
            </div>
        </div >

    )


}


export default HomePage;
