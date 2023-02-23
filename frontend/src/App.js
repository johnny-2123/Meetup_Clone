import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router";
import LoginFormPage from "./components/LoginFormPage";
import * as sessionActions from "./store/session";
import SignUpPage from "./components/SignUpPage";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState();

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true))

  }, [dispatch])

  return (
    <>
      <h1>React</h1>
      <Switch>
        <Route path='/login'>
          <LoginFormPage />
        </Route>
        <Route path='/signup'>
          <SignUpPage />
        </Route>
      </Switch>

    </>
  )
}

export default App;
