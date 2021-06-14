import React, { useEffect, useState } from "react";
import axios from "axios";
import { POST, USER, LIKE, MIXED_POST_DATA } from "../../../utils/type";
import { Link } from "react-router-dom";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";

const Top: React.FC = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const [posts, setPosts] = useState<MIXED_POST_DATA[]>([]);
    const [allUsers, setAllUsers] = useState<USER[]>([]);
    const [likes, setLikes] = useState<LIKE[]>([]);
    const [test, setTest] = useState("");
    let huga: any;
    useEffect(() => {
        console.log("hi");
        //投稿取得(10個)
        axios
            .get("/api/get")
            .then(res => {
                setPosts(res.data as MIXED_POST_DATA[]);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);
    //いいね機能
    const onAddLike = (user_id: number, post_id: number) => {
        axios
            .post("/api/add/like", {
                user_id,
                post_id
            })
            .then(res => {
                setLikes(res.data);
            })
            .catch(error => console.log(error));
    };
    //投稿ごとのいいね数を返す関数
    const getNumberOfLikes = (postId: number) => {
        let numberOfLikes = 0;
        likes.map(like => {
            console.log(like);
            if (like.post_id === postId) {
                numberOfLikes++;
            }
        });
        return <p>{numberOfLikes}</p>;
    };
    //いいねしたことあるかチェック
    const checkLikedBefore = (postId: number) => {
        const isLikedBefore = likes.map(like => {
            if (like.post_id === postId) {
                if (like.user_id === user?.id) {
                    return true;
                } else {
                    return false;
                }
            }
        });
        const result = isLikedBefore.some(liked => liked === true);
        console.log("chacke=>", result);
        return result;
    };
    //いいね解除
    const onRemoveLike = (user_id: number, post_id: number) => {
        likes.map(like => {
            if (like.post_id === post_id) {
                if (like.user_id === user_id) {
                    console.log("likeId=", like.id);
                    axios
                        .post("/api/remove/like", { id: like.id })
                        .then(res => {
                            setLikes(res.data);
                        })
                        .catch(error => console.log(error));
                }
            }
        });
    };
    return (
        <div>
            <h1>みんなの投稿</h1>
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
                                        <button
                                            onClick={() =>
                                                onAddLike(user.id, post.post.id)
                                            }
                                        >
                                            いいね
                                        </button>
                                        <p>いいね数：{post.likes.length}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            <Link to="create">新規</Link>
            <Link to="user">ユーザー情報</Link>
        </div>
    );
};

export default Top;
