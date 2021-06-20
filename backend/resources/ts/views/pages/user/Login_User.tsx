import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useHistory } from "react-router";
import { RootState } from "../../../store";
import axios from "axios";
import { FOLLOW, LIKE, MIXED_POST_DATA, POST, USER } from "../../../utils/type";
import { Link } from "react-router-dom";

type FollowLength = {
    followeeLength: number;
    followerLength: number;
};

const Login_User = () => {
    const myUserId = useSelector((state: RootState) => state.user.user?.id);
    const history = useHistory();
    const [user, setUser] = useState<USER>();
    const [posts, setPosts] = useState<MIXED_POST_DATA[]>([]);
    const [follows, setFollows] = useState<FOLLOW[]>([]);
    const [followLength, setFollowLength] = useState<FollowLength>();
    const [isFollow, setIsFollow] = useState(false);
    useEffect(() => {
        //パラメーターに則ったユーザー情報取得
        if (myUserId) {
            axios
                .get("/api/get/user", { params: { userId: myUserId } })
                .then(res => {
                    const data = res.data;
                    setUser(data.user);
                    //そのユーザーの投稿全部取得
                    setPosts(data.posts);
                })
                .catch(error => {
                    console.log(error);
                });
            //該当のユーザーの、フォロー・フォロワー数取得
            axios
                .get("/api/get/follow", { params: { userId: myUserId } })
                .then(res => {
                    console.log(res.data);
                    setFollowLength({
                        followeeLength: res.data.followee,
                        followerLength: res.data.follower
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            axios
                .get("/json")
                .then(res => {
                    axios
                        .get("/api/get/user", {
                            params: { userId: res.data.id }
                        })
                        .then(res => {
                            const data = res.data;
                            setUser(data.user);
                            //そのユーザーの投稿全部取得
                            setPosts(data.posts);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                    //該当のユーザーの、フォロー・フォロワー数取得
                    axios
                        .get("/api/get/follow", {
                            params: { userId: res.data.id }
                        })
                        .then(res => {
                            console.log(res.data);
                            setFollowLength({
                                followeeLength: res.data.followee,
                                followerLength: res.data.follower
                            });
                        })
                        .catch(error => {
                            console.log(error);
                        });
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, []);

    return (
        <div>
            aaaaaa
            {user && (
                <>
                    <p>名前:{user.name}</p>qqq
                    <div>
                        {followLength && (
                            <div>
                                <Link to={`/${user.name}/followee/${user.id}`}>
                                    <p>
                                        フォロー数:
                                        {followLength.followeeLength}
                                    </p>
                                </Link>
                                <Link to={`/${user.name}/follower/${user.id}`}>
                                    <p>
                                        フォロワー数:
                                        {followLength.followerLength}
                                    </p>
                                </Link>
                            </div>
                        )}
                    </div>
                </>
            )}
            {posts[0] &&
                posts.map((post, i) => {
                    return (
                        <div key={i}>
                            <div>
                                <p>投稿者：{post.user.name}</p>
                            </div>

                            <div>
                                <a href={post.post.url} target="_blank">
                                    <p>タイトル：{post.post.body}</p>
                                    <img src={post.post.image} />
                                </a>
                            </div>
                            <div>
                                {user && (
                                    <Link
                                        to={{
                                            pathname: `/${user?.name}/post/${post.post.id}`,
                                            state: {
                                                post: post.post,
                                                user: post.user,
                                                likes: post.likes
                                            }
                                        }}
                                    >
                                        <p>コメント：{post.post.body}</p>
                                    </Link>
                                )}
                            </div>
                            <div>
                                {user && (
                                    <>
                                        <button>いいね</button>
                                        <p>いいね数：{post.likes.length}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};

export default Login_User;
