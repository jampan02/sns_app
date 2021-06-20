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

const User = () => {
    const myUserId = useSelector((state: RootState) => state.user.user?.id);
    const history = useHistory();
    const [user, setUser] = useState<USER>();
    const [posts, setPosts] = useState<MIXED_POST_DATA[]>([]);
    const [follows, setFollows] = useState<FOLLOW[]>([]);
    const [followLength, setFollowLength] = useState<FollowLength>();
    const [isFollow, setIsFollow] = useState(false);
    const params: { id: string } = useParams();
    const id = params.id;
    useEffect(() => {
        //パラメーターに則ったユーザー情報取得
        axios
            .get("/api/get/user", { params: { userId: id } })
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
            .get("/api/get/follow", { params: { userId: id } })
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
        //フォロー中かどうか調べる
        if (myUserId) {
            console.log("lognnin");
            axios
                .get("/api/get/isfollow", {
                    params: { followee: myUserId, follower: id }
                })
                .then(res => {
                    console.log(res.data);
                    if (res.data === "yes") {
                        setIsFollow(true);
                    } else {
                        setIsFollow(false);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            axios
                .get("/json")
                .then(res => {
                    if (res.data) {
                        console.log("logout");
                        const user_id = res.data.id;
                        console.log(res.data);
                        axios
                            .get("/api/get/isfollow", {
                                params: { followee: user_id, follower: id }
                            })
                            .then(res => {
                                console.log(res.data);
                                if (res.data === "yes") {
                                    setIsFollow(true);
                                } else {
                                    setIsFollow(false);
                                }
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, []);
    //フォロー関数
    const onFollow = (targetId: number) => {
        if (myUserId) {
            axios
                .post("/api/add/follow", {
                    followee: myUserId,
                    follower: targetId
                })
                .then(res => {
                    setFollowLength({
                        followeeLength: res.data.followee,
                        followerLength: res.data.follower
                    });
                    setIsFollow(true);
                    /*if (followLength)
                        setFollowLength({
                            followeeLength: followLength.followeeLength,
                            followerLength: followLength.followerLength++
                        });
                    setIsFollow(true);*/
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            history.push("/register");
        }
    };
    //フォロー解除関数
    const onRemoveFollow = (targetId: number) => {
        if (myUserId) {
            axios
                .post("/api/del/follow", {
                    followee: myUserId,
                    follower: targetId
                })
                .then(res => {
                    console.log(res.data);
                    setFollowLength({
                        followeeLength: res.data.followee,
                        followerLength: res.data.follower
                    });
                    setIsFollow(false);
                    /* if (followLength)
                        setFollowLength({
                            followeeLength: followLength.followeeLength,
                            followerLength: followLength.followerLength--
                        });
                    setIsFollow(false);*/
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            history.push("/register");
        }
    };
    const isCanFollow = (userId: number) => {
        let isUserSame = false;
        if (myUserId) {
            if (userId === myUserId) {
                isUserSame = true;
            }
        }
        return isUserSame;
    };

    return (
        <div>
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
                        {isCanFollow(user.id) ? null : isFollow ? (
                            <button onClick={() => onRemoveFollow(user.id)}>
                                フォローはずす
                            </button>
                        ) : (
                            <button onClick={() => onFollow(user.id)}>
                                フォローする
                            </button>
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

export default User;
