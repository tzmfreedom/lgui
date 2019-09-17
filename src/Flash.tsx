import React from 'react';
import { Snackbar } from '@material-ui/core';

type FlashProps = {
  flash: Array<any>
  onClose: any
}

const Flash: React.FC<FlashProps> = (props: FlashProps) => {
  const { flash, onClose } = props;
  return (
    <>
    {flash.length > 0 && (
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        key="flash-message"
        open={true}
        onClose={onClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{flash}</span>}
      />
    )}
    </>
  )
}

export default Flash;
