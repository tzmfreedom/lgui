import React from 'react';
import Button from '@material-ui/core/Button';
const jsforce = require('jsforce');

const Login: React.FC = () => {
  return (
    <Button variant="contained" color="primary" onClick={() => { }}>Login with Salesforce</Button>
  );
}

export default Login;
