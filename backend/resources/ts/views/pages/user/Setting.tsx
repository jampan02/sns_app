import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { RootState } from "../../../store";
import { checkIsAuth } from "../../../store/api/api";
import { login_user } from "../../../store/counter/user/action";

const Setting = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user);
    const history = useHistory();
    useEffect(() => {
        const f = async () => {
            if (!user) {
                await axios
                    .get("/json")
                    .then(res => {
                        if (res.data) {
                            dispatch(login_user(res.data));
                        } else {
                            history.push("/register");
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        };
        f();
    }, []);
    return <div>setting menu</div>;
};

export default Setting;
