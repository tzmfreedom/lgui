import React, { useState } from 'react';

type Props = {
    message: string
}

const Button: React.FC<Props> = (props: Props) => {
  const [message, setMessage] = useState(props.message);
  return (
    <div className="Button">
      <input type="text" onChange={(e) => { setMessage(e.target.value) }}/>
      <div>{message}</div>
    </div>
  );
}

export default Button;
