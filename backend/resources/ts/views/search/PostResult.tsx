import axios from "axios";
import React, { useEffect, ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { MIXED_POST_DATA, POST } from "../../utils/type";
import { useHistory, useLocation } from "react-router";
import queryString from "query-string";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
const PostResult = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const [posts, setPosts] = useState<MIXED_POST_DATA[]>([]);
    const location = useLocation();
    const history = useHistory();
    useEffect(() => {
        //クエリ取得
        const parsed = queryString.parse(location.search);
        const query = parsed.q as string;
        console.log("q=", query);
        axios
            .get("/api/get/post/search", { params: { q: query } })
            .then(res => {
                console.log(res.data);
                setPosts(res.data);
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
            {}
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
                                <button
                                    onClick={() => {
                                        if (user) {
                                            onAddLike(user.id, post.post.id);
                                        } else {
                                            history.push("/register");
                                        }
                                    }}
                                >
                                    いいね
                                </button>
                                <p>いいね数：{post.likes.length}</p>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};

export default PostResult;
