import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router";
import * as sessionActions from "./store/session";
import LoginFormPage from "./components/LoginFormModal";
import SignUpPage from "./components/SignUpPage";
import CSSTestPage from "./components/CSSTest";
import Navigation from "./components/Navigation";
import HomePage from "./components/HomePage";
import SeeAllGroups from "./components/GroupComponents/SeeAllGroups/SeeAllGroups";
import SeeAllEvents from "./components/SeeAllEvents";
import NewGroupForm from './components/GroupComponents/NewGroup/index.js'
import { useModal } from "./context/Modal";
import GroupDetailsComponent from "./components/GroupComponents/GroupDetails";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState();
  const { showLogin, showSignUp } = useModal();

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true))

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
        <Route path={`/groups/new`}>
          <NewGroupForm />
        </Route>
        <Route path='/groups/:groupId'>
          <GroupDetailsComponent />
        </Route>
        <Route path='/login'>
          <LoginFormPage />
        </Route>
        <Route path='/signup'>
          <SignUpPage />
        </Route>
        <Route path='/csstest'>
          <CSSTestPage />
        </Route>
      </Switch>

    </div>
  )
}

export default App;
