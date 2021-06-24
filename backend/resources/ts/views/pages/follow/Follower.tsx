import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useHistory } from "react-router";
import { RootState } from "../../../store";
import axios from "axios";
import { FOLLOW, LIKE, MIXED_POST_DATA, POST, USER } from "../../../utils/type";
import { Link } from "react-router-dom";

const Follower = () => {
    const params: { id: string; user: string } = useParams();
    const userName = params.user;
    const userId = Number(params.id);
    const [users, setUsers] = useState<USER[]>([]);
    useEffect(() => {
        axios
            .get("/api/get/follower", { params: { user_id: userId } })
            .then(res => {
                console.log(res.data);
                setUsers(res.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);
    return (
        <div>
            {userName}フォロワー　一覧
            {users[0] &&
                users.map((user, i) => {
                    return (
                        <div key={i}>
                            <Link to={`/${user.name}/user/${user.id}`}>
                                <img src={user.profile_image} />
                                <p>名前：{user.name}</p>
                            </Link>
                        </div>
                    );
                })}
        </div>
    );
};

export default Follower;
