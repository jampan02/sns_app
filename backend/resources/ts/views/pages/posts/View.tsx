import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router";
import { RootState } from "../../../store";
import { COMMENT, LIKE, MIXED_POST_DATA, USER } from "../../../utils/type";

type DATA = {
    like: LIKE;
    user: USER;
};

type USERCOMMENT = {
    user: USER;
    comment: COMMENT;
};

const View = () => {
    const history = useHistory();
    const user = useSelector((state: RootState) => state.user);
    const location: {
        pathname: string;
        state: MIXED_POST_DATA;
    } = useLocation();
    const [likes, setLikes] = useState<DATA[]>([]);
    const [comments, setComments] = useState<USERCOMMENT[]>([]);
    const [isOpenComment, setIsOpenComment] = useState(false);
    const [comment, setComment] = useState("");
    useEffect(() => {
        //ライクしたユーザー情報取得
        if (location.state.likes.length > 0) {
            const data = location.state.likes.map(like => like.user_id);
            axios
                .get("/api/get/like/user", {
                    params: { data }
                })
                .then(res => {
                    console.log(res.data);
                    setLikes(res.data);
                })
                .catch(error => {
                    console.log(error);
                });
        }
        axios
            .get("/api/get/comment", {
                params: { postId: location.state.post.id }
            })
            .then(res => {
                setComments(res.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);
    //コメント送信機能
    const onAddComment = () => {
        if (comment === "") {
            return;
        }
        if (user.user) {
            const data = {
                comment,
                user_id: user.user.id,
                post_id: location.state.post.id
            };
            axios
                .post("/api/add/comment", data)
                .then(res => {
                    setComments(res.data);
                    setComment("");
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };
    return (
        <div>
            <div>
                <p>投稿者：{location.state.user.name}</p>
            </div>
            <div>
                <a href={location.state.post.url} target="_blank">
                    <p>タイトル：{location.state.post.title}</p>
                    <img src={location.state.post.image} />
                </a>
            </div>
            <div>
                <p>{likes.length}いいね</p>
                <p>いいね一覧</p>
                {likes[0] &&
                    likes.map((like, i) => {
                        return <p key={i}>{like.user.name}</p>;
                    })}
            </div>
            <div>
                <button
                    onClick={() => {
                        if (!user.isLogin) {
                            //ログインされてない場合
                            history.push("/register");
                        }
                        setIsOpenComment(!isOpenComment);
                    }}
                >
                    コメントする
                </button>
                <div>
                    {isOpenComment && (
                        <div>
                            <input
                                type="text"
                                placeholder="コメント"
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                            />
                            <button onClick={onAddComment}>送信</button>
                        </div>
                    )}
                </div>
                <div>
                    {comments[0] &&
                        comments.map((comment, i) => (
                            <div key={i}>
                                <p>投稿主：{comment.user.name}</p>
                                <p>コメント：{comment.comment.comment}</p>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default View;
