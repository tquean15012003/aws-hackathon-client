import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import { ChatReducer } from './Reducers';

const reducer = combineReducers({
    ChatReducer
});

export const store = configureStore({reducer});