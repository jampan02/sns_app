import axios from "axios";
import React, { useEffect, ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { MIXED_POST_DATA, POST, USER } from "../../utils/type";
import { useHistory, useLocation } from "react-router";
import queryString from "query-string";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
const UserResult = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const [users, setUsers] = useState<USER[]>([]);
    const location = useLocation();
    const history = useHistory();
    useEffect(() => {
        //クエリ取得
        const parsed = queryString.parse(location.search);
        const query = parsed.q as string;
        console.log("q=", query);
        axios
            .get("/api/get/user/search", { params: { q: query } })
            .then(res => {
                console.log(res.data);
                setUsers(res.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [location]);
    //いいね機能
    const onAddLike = (user_id: number, post_id: number) => {
        axios.post("/api/add/like", {
            user_id,
            post_id
        });
    };
    return (
        <div>
            {users[0] &&
                users.map((user, i) => {
                    return (
                        <div key={i}>
                            <Link to={`/${user.name}/user/${user.id}`}>
                                <p>名前：{user.name}</p>
                            </Link>
                        </div>
                    );
                })}
        </div>
    );
};

export default UserResult;
