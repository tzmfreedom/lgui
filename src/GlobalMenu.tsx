import React, { useState, useCallback } from 'react';
import { withRouter } from 'react-router';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const GlobalMenu: React.FC<any> = (props: any) => {
  const m = window.location.pathname.match(/^(\/[a-zA-Z\d_]+)\/[a-zA-Z\d]+/);
  const path: string = m ? m[1] : window.location.pathname;
  const [tabValue, setTabValue] = useState(path);
  const handleChange = useCallback((event: any, value: string) => {
    setTabValue(value)
    props.history.push(value)
  }, []);
  return (
    <AppBar position="static">
      <Tabs
        value={tabValue}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto" >
        <Tab label="Home" value="/" />
        {props.objects.map((object: any) => {
          return <Tab key={object} label={object} value={`/${object}`} />
        })}
        <Tab label="Setting" value="/setting" />
      </Tabs>
    </AppBar>
  );
}

export default withRouter(GlobalMenu);
