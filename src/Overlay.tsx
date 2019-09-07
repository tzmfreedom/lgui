import React from 'react';
import {useSelector} from "react-redux";
import { CircularProgress } from '@material-ui/core';

const Overlay: React.FC = () => {
  const overlay = useSelector((state: any) => state.overlay);
  return (
    <>
      { overlay && (
        <div className="overlay">
          <CircularProgress className="circular-progress"/>
        </div>
      )}
    </>
  );
}

export default Overlay;
