import React, { useEffect, useState } from "react";
import axios from "axios";
import { POST, USER, LIKE, MIXED_POST_DATA } from "../../../utils/type";
import { Link } from "react-router-dom";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

const Top: React.FC = () => {
    const history = useHistory();
    const user = useSelector((state: RootState) => state.user.user);
    const [posts, setPosts] = useState<MIXED_POST_DATA[]>([]);
    const [likes, setLikes] = useState<LIKE[]>([]);
    const [isNewer, setIsNewer] = useState(true);
    let huga: any;
    useEffect(() => {
        console.log("hi");
        //投稿取得(10個)
        axios
            .get("/api/get/posts/sort/new")
            .then(res => {
                setPosts(res.data as MIXED_POST_DATA[]);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);
    //いいね機能
    const onAddLike = (post_id: number, index: number) => {
        if (user) {
            const user_id = user.id;
            console.log(index);
            const indexNumber = index;
            axios
                .post("/api/add/like", {
                    user_id,
                    post_id
                })
                .then(res => {
                    console.log(res.data);
                    console.log(posts);

                    setPosts(
                        posts.map((post, i) => {
                            if (i === indexNumber) {
                                return res.data;
                            } else {
                                return post;
                            }
                        })
                    );

                    console.log(posts);
                })
                .catch(error => console.log(error));
        } else {
            history.push("/register");
        }
    };
    //いいね解除
    const onRemoveLike = (post_id: number, index: number) => {
        if (user) {
            const user_id = user.id;
            axios
                .post("/api/del/like", {
                    user_id,
                    post_id
                })
                .then(res => {
                    console.log(res.data);
                    console.log(posts);

                    setPosts(
                        posts.map((post, i) => {
                            if (i === index) {
                                return res.data;
                            } else {
                                return post;
                            }
                        })
                    );
                });
        } else {
            history.push("/register");
        }
    };
    //いいねしたことあるか、
    const isLikedBefore = (post: MIXED_POST_DATA) => {
        if (user) {
            const even = (like: LIKE) => like.user_id === user.id;
            const isLiked = post.likes.some(even);
            return isLiked;
        }
    };
    //良いね順にｿｰﾄ
    /* const onSortPopular = () => {
        axios
            .get("/api/get/posts/sort/popular")
            .then(res => {
                setPosts(res.data as MIXED_POST_DATA[]);
                setIsNewer(false);
            })
            .catch(error => {
                console.log(error);
            });
    };*/
    //新しい純
    const onSortNewer = () => {
        axios
            .get("/api/get/posts/sort/new")
            .then(res => {
                setPosts(res.data as MIXED_POST_DATA[]);
                setIsNewer(true);
            })
            .catch(error => {
                console.log(error);
            });
    };
    return (
        <div>
            <h1>みんなの投稿new</h1>
            {isNewer ? <p>あたらしいじゅん</p> : <p>にんきじゅん</p>}
            <button onClick={onSortNewer}>新しい順</button>
            {/* <button onClick={onSortPopular}>人気順</button> */}

            {posts[0] &&
                posts.map((post, i) => {
                    return (
                        <div key={i}>
                            <div>
                                <Link
                                    to={`/${post.user.name}/user/${post.user.id}`}
                                >
                                    <p>投稿者：{post.user.name}</p>
                                </Link>
                            </div>
                            <div>
                                <a href={post.post.url} target="_blank">
                                    <p>タイトル：{post.post.title}</p>
                                    <img src={post.post.image} />
                                </a>
                            </div>
                            <div>
                                <Link
                                    to={{
                                        pathname: `/${post.user.name}/post/${post.post.id}`,
                                        state: {
                                            post: post.post,
                                            user: post.user,
                                            likes: post.likes
                                        }
                                    }}
                                >
                                    <p>コメント：{post.post.body}</p>
                                </Link>
                            </div>
                            <div>
                                {isLikedBefore(post) ? (
                                    <button
                                        onClick={() => {
                                            onRemoveLike(post.post.id, i);
                                        }}
                                    >
                                        いいねはずす
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            onAddLike(post.post.id, i);
                                        }}
                                    >
                                        いいね
                                    </button>
                                )}

                                <p>いいね数：{post.likes.length}</p>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};

export default Top;
