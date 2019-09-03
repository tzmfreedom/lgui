import { createStore } from 'redux';

const INIT_STATE = {
    message: 'hoge',
    conn: null,
};

const rootReducer = (state: any = INIT_STATE, action: any) => {
    switch (action.type) {
        case 'message-change':
            return Object.assign({}, state, {
                message: action.value,
            });
        case 'connection-created':
            return Object.assign({}, state, {
                conn: action.conn,
            });
    }
    return state;
}

export default function createFinalStore() {
    return createStore(rootReducer);
}
