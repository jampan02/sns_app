import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory, useLocation } from "react-router";
import { RootState } from "../../../store";
import axios from "axios";
import { USER } from "../../../utils/type";
import { login_user } from "../../../store/counter/user/action";
import { Helmet } from "react-helmet";
import Posts from "../../components/Posts";
import User from "../../components/User";

type FollowLength = {
    followeeLength: number;
    followerLength: number;
};

const Poster = () => {
    const myUserId = useSelector((state: RootState) => state.user.user?.id);
    const [user, setUser] = useState<USER>();
    const [followLength, setFollowLength] = useState<FollowLength>({
        followeeLength: 0,
        followerLength: 0
    });
    const [isFollow, setIsFollow] = useState(false);
    const params: { id: string } = useParams();
    const id = params.id;
    const dispatch = useDispatch();
    const location: {
        pathname: string;
        state: USER;
    } = useLocation();
    useEffect(() => {
        //パラメーターに則ったユーザー情報取得
        const f = async () => {
            if (location.state) {
                setUser(location.state);
            } else {
                //直リンクの場合
                await axios
                    .get("/api/get/user", { params: { user_id: id } })
                    .then(res => {
                        setUser(res.data);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        };
        f();
    }, []);

    if (user) {
        return (
            <>
                <Helmet>
                    <title>{user.name}さん | ゆうあるえる</title>
                </Helmet>

                <User user={user} isLoginUser={false} />
                <Posts path="/api/get/post/scroll/user" user_id={user.id} />
            </>
        );
    } else {
        return null;
    }
};

export default Poster;
