import { createStore } from 'redux';

const INIT_STATE = {
    message: 'hoge',
    conn: null,
    flash: [],
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
        case 'add-flash-message':
            return Object.assign({}, state, {
                flash: state.flash.concat(action.value),
            });
        case 'clear-flash-message':
            return Object.assign({}, state, {
                flash: [],
            });
    }
    return state;
}

export default function createFinalStore() {
    return createStore(rootReducer);
}
