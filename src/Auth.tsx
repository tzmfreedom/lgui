import React, { useEffect } from 'react';
import {useDispatch, useSelector } from "react-redux";
import { Redirect } from 'react-router';
import { connectionCreated } from './actions';
const jsforce = require('jsforce');

const Auth: React.FC<any> = (props: any) => {
  const dispatch = useDispatch();
  const conn = useSelector((state: any) => state.conn)
  useEffect(() => {
    if (jsforce.browser.connection && jsforce.browser.connection.instanceUrl !== '') {
      dispatch(connectionCreated(jsforce.browser.connection))
    } else {
      jsforce.browser.login();
      jsforce.browser.on('connect', function (conn: any) {
        dispatch(connectionCreated(conn))
      });
    }
  }, [])

  if (conn == null) {
    return <></>
  } else {
    return <>{props.children}</>;
  }
}

export default Auth;
