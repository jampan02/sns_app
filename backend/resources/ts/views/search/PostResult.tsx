import axios from "axios";
import React, { useEffect, useState } from "react";
import { MIXED_POST_DATA } from "../../utils/type";
import { useLocation } from "react-router";
import queryString from "query-string";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { login_user } from "../../store/counter/user/action";
import { Helmet } from "react-helmet";
import Posts from "../components/Posts";
const PostResult = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const [posts, setPosts] = useState<MIXED_POST_DATA[]>([]);

    const location = useLocation();
    const parsed = queryString.parse(location.search);
    const query = parsed.q as string;

    const dispatch = useDispatch();
    useEffect(() => {
        const f = async () => {
            if (!user) {
                //ログインされていない場合

                await axios
                    .get("/json")
                    .then(res => {
                        if (res.data) {
                            dispatch(login_user(res.data));
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        };
        f();
    }, []);

    return (
        <div>
            <Helmet>
                <title>"{query}"に関する投稿の検索結果 | ゆうあるえる</title>
            </Helmet>
            <Posts path="/api/get/post/search" q={query} />
        </div>
    );
};

export default PostResult;
