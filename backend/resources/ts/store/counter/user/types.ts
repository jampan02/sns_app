import { Action } from "redux";
import { USER } from "../../../utils/type";
import { ActionTypes } from "../../actionTypes";

interface LoginUserAction extends Action {
    type: typeof ActionTypes.login_user;
    payload: USER;
}
interface LogoutUserAction extends Action {
    type: typeof ActionTypes.logout_user;
}

export type UserActionTypes = LoginUserAction | LogoutUserAction;

export type UserState = {
    isLogin: boolean;
    user?: USER;
};
