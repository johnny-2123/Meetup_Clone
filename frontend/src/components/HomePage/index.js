import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { fetchUpcomingEvents } from '../../store/events'
import { useModal } from "../../context/Modal";
import UpcomingEvents from './upcomingEvents';
import './HomePage.css'

const HomePage = () => {

    const sessionUser = useSelector(state => state.session?.user);
    const [userLoggedIn, setUserLoggedIn] = useState(true);
    let homeStartGroupIdName = !userLoggedIn ? "homeThirdSectionDivDisabled" : "homeThirdSectionDiv";
    let joinMeetupClassName = !userLoggedIn ? "joinButton" : "joinButtonHidden";
    let welcomeMessageClass = !userLoggedIn ? 'welcomeMessageDisabled' : 'WelcomeMessage';


    useEffect(() => {
        if (sessionUser?.user) {
            setUserLoggedIn(true)

        } else {
            setUserLoggedIn(false)
        }
    }, [sessionUser])

    const { setShowSignUp } = useModal();

    return (
        < div className='containerHome' >
            <div className='homeTopSection'>
                <div >
                    <h2 className={welcomeMessageClass}>Welcome {sessionUser?.user?.firstName}</h2>
                    <h1>The people platform - <br></br> Where interests become friendships</h1>
                    <p>Lorem ipsum dolor sit amet. Et accusamus voluptatem et earum amet qui aspernatur molestias aut illo soluta ut veritatis sapiente. Et commodi debitis aut eius dolor cum laborum molestiae est maiores.</p>
                </div>
                <img className='homePageImage' src='https://res.cloudinary.com/dkul3ouvi/image/upload/v1677379615/vecteezy_back-view-of-man-and-woman-friends-standing-together_5638987_xppydz.jpg' alt='Friends Vector by Vecteezy' />
            </div>
            <div className='homeMiddleSection'>
                <h2>How Meetup works</h2>
                <p>Meet new people who share your interests through online and in-person events. It's free to create an account. </p>
            </div>
            <div className='homeThirdSection'>
                <div className='homeThirdSectionDiv'>
                    <i className="fa-solid fa-handshake"></i>
                    <NavLink className={`homePageSection3Links`} to='/groups'>See All Groups</NavLink>
                    <p>Do what you love, meet others who love it, find your community. The rest is history!</p>
                </div>
                <div className='homeThirdSectionDiv'>
                    <i className="fa-solid fa-ticket"></i>
                    <NavLink className={`homePageSection3Links`} to='/events'>Find an Event</NavLink>
                    <p>Events are happening on just about any topic you can think of, from online gaming and photography to yoga and hiking.</p>
                </div>
                <div id={homeStartGroupIdName} className='homeThirdSectionDiv'>
                    <i className="fa-solid fa-people-group"></i>
                    <NavLink className={`homePageSection3Links`} to='/groups/new'>Start a Group</NavLink>
                    <p>You don't have to be an expert to gather people together and explore shared interests.</p>
                </div>
            </div>
            <div className='homeFourthSection'>
                <button className={joinMeetupClassName} onClick={() => setShowSignUp(true)}>Join Meetup</button>
            </div>
            <UpcomingEvents />
            <div className='homePageFooter' >
                <a className={'homePageFooterLinks'} href={'https://github.com/johnny-2123/Project1/wiki'}>Github Wiki</a>
            </div>
        </div >

    )
}


export default HomePage;
