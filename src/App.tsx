import React from 'react';
import List from './List';
import Form from './Form';
import './App.scss';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import GlobalMenu from "./GlobalMenu";
import createFinalStore from './store';
import yaml from 'js-yaml';
import { useDispatch, useSelector } from "react-redux";
import Login from './Login';
const config = yaml.safeLoad("objects: [Account, Contact]");
const jsforce = require('jsforce');

jsforce.browser.init({
  clientId: '3MVG9yZ.WNe6byQBYCaGTfGZBI2WUkHn3q7JxWEK2MRDUNH6RYrCYLXCpmqqyi.M1W8b3.1jy0IFiQuHGhIOs',
  redirectUri: 'http://localhost:3000'
});

const App: React.FC = () => {
  // const path = window.location.pathname;
  // const conn = useSelector((state: any) => state.conn);
  // if (path !== "/login" && conn === null) {
  //   window.location.href = "/login"
  // }
  return (
    <Provider store={createFinalStore()}>
      <div className="App">
        <BrowserRouter>
          <GlobalMenu objects={config.objects}/>
          <Switch>
            <Route exact path='/' component={Home} />
            {config.objects.map((object: string) => {
              return <Route key={object} exact path={'/' + object} render={() => <List object={object}/>} />
            })}
            <Route exact path='/Account/new' component={Form} />
            <Route exact path='/login' component={Login} />
          </Switch>
        </BrowserRouter>
      </div>
    </Provider>
  );
}

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const messageChangeAction = (e: any) => {
    return {
      type: 'message-change',
      value: e.target.value,
    }
  };
  const message = useSelector((state: any) => state.message);

  jsforce.browser.on('connect', function(conn: any) {
    dispatch({
      type: 'connection-created',
      conn: conn,
    })
  });

  return (
    <div>
      <input type="text" value={message} onChange={(e) => dispatch(messageChangeAction(e))} />
      <div>{message}</div>
    </div>
  )
}

export default App;
