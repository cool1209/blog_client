import {
    AnyAction,
    combineReducers,
    configureStore,
    Reducer,
} from "@reduxjs/toolkit";

const combinedReducer = combineReducers({});

export type RootState = ReturnType<typeof combinedReducer>;

const rootReducer: Reducer = (
    state: ReturnType<typeof store.getState>,
    action: AnyAction
) => {
    if (action.type === "users/logout") {
        state = undefined;
    }
    return combinedReducer(state, action);
};

const store = configureStore({
    reducer: rootReducer,
});

export default store;
