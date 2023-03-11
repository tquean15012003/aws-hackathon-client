import { SET_NAME_AND_ROOM } from "./Constants";

const stateDefault = {
    username: "Test",
    room: 1
};

export const ChatReducer = (state = stateDefault, action) => {
    switch (action.type) {
        case SET_NAME_AND_ROOM: {
            return { ...state, username: action.username, room: action.room }
        }
        default:
            return { ...state }
    };
};