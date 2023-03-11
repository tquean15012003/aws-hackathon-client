import { SET_NAME_AND_ROOM } from "./Constants";

export const setNameAndRoomAction = (username, room) => ({
    type: SET_NAME_AND_ROOM,
    username,
    room
})