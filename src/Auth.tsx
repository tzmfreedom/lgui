import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import { Redirect } from 'react-router';
const jsforce = require('jsforce');

const Auth: React.FC<any> = (props: any) => {
  const dispatch = useDispatch();

  if (jsforce.browser.connection) {
    dispatch({
      type: 'connection-created',
      conn: jsforce.browser.connection
    });
  } else {
    jsforce.browser.on('connect', function(conn: any) {
      dispatch({
        type: 'connection-created',
        conn: conn,
      })
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
