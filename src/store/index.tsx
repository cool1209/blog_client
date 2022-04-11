// node_modules
import {
    AnyAction,
    combineReducers,
    configureStore,
    Reducer,
} from "@reduxjs/toolkit";

// slices
import meSlice from "./me-slice";
import blogsSlice from "./blogs-slice";

const combinedReducer = combineReducers({
    me: meSlice.reducer,
    blogs: blogsSlice.reducer,
});

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
