import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router";
import LoginFormPage from "./components/LoginFormPage";
import * as sessionActions from "./store/session";
import SignUpPage from "./components/SignUpPage";
import CSSTestPage from "./components/CSSTest";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState();

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true))

  }, [dispatch])

  return (
    <div className="AppDiv">
      <h1 className="mainHeader">React</h1>
      <Switch>
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
