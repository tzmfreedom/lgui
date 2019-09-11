
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
    conn,
  }
}

const cacheRecords = (object: string, records: Array<any>) => {
  return {
    type: 'cache-records',
    object,
    records,
  }
}

const cacheDescribe = (object: string, fields: Array<any>) => {
  return {
    type: 'cache-describe',
    object,
    fields,
  }
}

const setDescribeGlobal = (describeGlobalResult: Array<any>) => {
  return {
    type: 'set-describe-global',
    describeGlobalResult,
  }
}

export {
  setOverlay,
  clearOverlay,
  addFlashMessage,
  clearFlashMessage,
  connectionCreated,
  cacheRecords,
  cacheDescribe,
  setDescribeGlobal,
}
