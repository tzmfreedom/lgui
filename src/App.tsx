import React from 'react';
import List from './List';
import Form from './Form';
import Auth from './Auth';
import Setting from './Setting';
import './App.scss';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import GlobalMenu from "./GlobalMenu";
import createFinalStore from './store';
import yaml from 'js-yaml';
import Login from './Login';
import Overlay from './Overlay';
import ConfigStore from './ConfigStore';
const config: any = ConfigStore.getObject('lgui-settings');
const jsforce = require('jsforce');

jsforce.browser.init({
  clientId: '3MVG9yZ.WNe6byQBYCaGTfGZBI2WUkHn3q7JxWEK2MRDUNH6RYrCYLXCpmqqyi.M1W8b3.1jy0IFiQuHGhIOs',
  redirectUri: 'http://localhost:3000'
});

const App: React.FC = () => {
  return (
    <Provider store={createFinalStore()}>
      <div className="App">
        <BrowserRouter>
          <GlobalMenu objects={config.objects}/>
          <Switch>
            {config.objects.map((object: string) => {
              return <Route key={object} exact path={'/' + object} render={(props: any) => <Auth><List object={object} {...props} /></Auth>} />
            })}
            {config.objects.map((object: string) => {
              return <Route key={object + '_create'} exact path={'/' + object + '/new'} render={(props: any) => <Auth><Form object={object} {...props} /></Auth>} />
            })}
            {config.objects.map((object: string) => {
              return <Route key={object + '_update'} exact path={'/' + object + '/:id'} render={(props: any) => <Auth><Form object={object} id={props.match.params.id} {...props} /></Auth>} />
            })}
            <Route exact path='/' component={Home} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/setting' render={(props: any) => <Auth><Setting {...props}/></Auth>} />
          </Switch>
          <Overlay/>
        </BrowserRouter>
      </div>
    </Provider>
  );
}

const Home: React.FC = () => {
  return (
    <div></div>
  )
}

export default App;
