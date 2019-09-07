
const setOverlay = () => {
  return {
    type: 'set-overlay',
  }
}

const clearOverlay = () => {
  return {
    type: 'clear-overlay',
  }
}

const addFlashMessage = (value: string) => {
  return {
    type: 'add-flash-message',
    value: value,
  }
}

const clearFlashMessage = () => {
  return {
    type: 'clear-flash-message',
  }
}

const connectionCreated = (conn: any) => {
  return {
    type: 'connection-created',
    conn: conn,
  }
}


export {
  setOverlay,
  clearOverlay,
  addFlashMessage,
  clearFlashMessage,
  connectionCreated,
}
