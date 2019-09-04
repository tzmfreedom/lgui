import React from 'react';
import { Link } from 'react-router-dom';

const GlobalMenu: React.FC<any> = (props: any) => {
  return (
    <div className="global-menu">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        {props.objects.map((object: any) => {
          return <li key={object}><Link to={'/' + object}>{object}</Link></li>
        })}
        {props.objects.map((object: any) => {
          return <li key={object}><Link to={`/${object}/new`}>{object} Create</Link></li>
        })}
      </ul>
    </div>
  );
}

export default GlobalMenu;
