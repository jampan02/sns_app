import { ActionTypes } from "../../actionTypes";
import { USER } from "../../../utils/type";
import { UserActionTypes, UserState } from "./types";

const initialState: UserState = {
    isLogin: false
};

export const userReducer = (
    state: UserState = initialState,
    action: UserActionTypes
) => {
    switch (action.type) {
        case ActionTypes.login_user:
            return {
                ...state,
                isLogin: true,
                user: action.payload
            };
        case ActionTypes.logout_user:
            return { isLogin: false, user: undefined };
        default:
            return state;
    }
};
