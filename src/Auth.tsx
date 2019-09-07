import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import { Redirect } from 'react-router';
import { connectionCreated } from './actions';
const jsforce = require('jsforce');

const Auth: React.FC<any> = (props: any) => {
  const dispatch = useDispatch();

  if (jsforce.browser.connection) {
    dispatch(connectionCreated(jsforce.browser.connection))
  } else {
    jsforce.browser.on('connect', function(conn: any) {
      dispatch(connectionCreated(conn))
    });
  }
  const conn = useSelector((state: any) => state.conn);

  if (conn === null) {
    return <Redirect to="/login"/>
  } else {
    return <>{props.children}</>;
  }
}

export default Auth;
