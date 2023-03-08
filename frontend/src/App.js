import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router";
import * as sessionActions from "./store/session";
import * as groupActions from "./store/groups";
import LoginFormPage from "./components/LoginFormModal";
import SignUpPage from "./components/SignUpPage";
import CSSTestPage from "./components/CSSTest";
import Navigation from "./components/Navigation";
import HomePage from "./components/HomePage";
import SeeAllGroups from "./components/GroupComponents/SeeAllGroups/SeeAllGroups";
import SeeCurrentUserGroups from "./components/GroupComponents/CurrentUserGroups"
import SeeAllEvents from './components/Events/SeeAllEvents';
import NewGroupForm from './components/GroupComponents/NewGroup/index.js'
import UpdateGroupPage from "./components/GroupComponents/UpdateGroup";
import UpdateEventPage from "./components/Events/UpdateEvent"
import { useModal } from "./context/Modal";
import GroupDetailsComponent from "./components/GroupComponents/GroupDetails";
import GroupMembersComponent from "./components/GroupComponents/GroupMembers";
import EventDetailsComponent from "./components/Events/EventDetails";
import NewEventForm from "./components/Events/NewEvent"

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState();
  const { showLogin, showSignUp } = useModal();

  useEffect(() => {
    dispatch(sessionActions.restoreUser())
      .then(() => setIsLoaded(true))

  }, [dispatch])

  return (
    <div className="AppDiv">
      <Navigation isLoaded={isLoaded} />
      {showLogin && <LoginFormPage />}
      {showSignUp && <SignUpPage />}
      <Switch>
        <Route exact path={`/`}>
          <HomePage />
        </Route>
        <Route exact path={`/events`}>
          < SeeAllEvents />
        </Route>
        <Route exact path={`/groups`}>
          <SeeAllGroups />
        </Route>
        <Route exact path={`/groups/current`}>
          <SeeCurrentUserGroups />
        </Route>
        <Route exact path={`/groups/new`}>
          <NewGroupForm />
        </Route>
        <Route exact path='/groups/:groupId/'>
          <GroupDetailsComponent />
        </Route>
        <Route exact path={`/groups/:groupId/members`}>
          <GroupMembersComponent />
        </Route>
        <Route exact path={`/groups/:groupId/edit`}>
          <UpdateGroupPage />
        </Route>
        <Route exact path={`/events`}>
          <SeeAllEvents />
        </Route>
        <Route exact path={`/events/new`}>
          <NewEventForm />
        </Route>
        <Route exact path={`/events/:eventId`}>
          <EventDetailsComponent />
        </Route>
        <Route exact path={'/events/:eventId/edit'}>
          <UpdateEventPage />
        </Route>
        <Route path='/csstest'>
          <CSSTestPage />
        </Route>
      </Switch>

    </div>
  )
}

export default App;
