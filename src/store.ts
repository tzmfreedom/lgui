import { createStore } from 'redux';

const INIT_STATE = {
    message: 'hoge',
    conn: null,
    flash: [],
    overlay: false,
    cache: {},
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
        case 'set-overlay':
            return Object.assign({}, state, {
                overlay: true,
            });
        case 'clear-overlay':
            return Object.assign({}, state, {
                overlay: false,
            });
        case 'cache-records':
            return (() => {
                const ret = Object.assign({}, state);
                if (!ret.cache[action.object]) {
                    ret.cache[action.object] = {}
                }
                ret.cache[action.object].records = action.records;
                return ret;
            })()
        case 'cache-describe':
            return (() => {
                const ret = Object.assign({}, state);
                if (!ret.cache[action.object]) {
                    ret.cache[action.object] = {}
                }
                ret.cache[action.object].describe = action.fields;
                return ret;
            })()
        case 'set-describe-global':
            return (() => {
                const ret = Object.assign({}, state);
                ret.cache.describeGlobalResult = action.describeGlobalResult;
                return ret;
            })()
    }
    return state;
}

export default function createFinalStore() {
    return createStore(rootReducer);
}
