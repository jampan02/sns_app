import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router";
import { RootState } from "../../../store";
import axios from "axios";
import { FOLLOW, LIKE, MIXED_POST_DATA, POST, USER } from "../../../utils/type";
import { Link } from "react-router-dom";
import { login_user } from "../../../store/counter/user/action";

type FollowLength = {
    followeeLength: number;
    followerLength: number;
};

const Login_User = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state: RootState) => state.user.user);
    //const myUserId = useSelector((state: RootState) => state.user.user?.id);
    const history = useHistory();
    const [user, setUser] = useState<USER>();
    const [posts, setPosts] = useState<MIXED_POST_DATA[]>([]);
    const [follows, setFollows] = useState<FOLLOW[]>([]);
    const [followLength, setFollowLength] = useState<FollowLength>();
    const [isFollow, setIsFollow] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [newUserName, setNewUserName] = useState("");
    const [newSelfIntroduction, setNewSelfIntroduction] = useState("");
    const [newProfileImage, setNewProfileImage] = useState("");
    useEffect(() => {
        //パラメーターに則ったユーザー情報取得
        // alert("fuck");
        const f = async () => {
            if (userData) {
                setUser(userData);
                await axios
                    .get("/api/get/user", { params: { userId: userData.id } })
                    .then(res => {
                        const data = res.data;
                        //そのユーザーの投稿全部取得
                        setPosts(data.posts);
                    })
                    .catch(error => {
                        console.log(error);
                    });
                //該当のユーザーの、フォロー・フォロワー数取得
                await axios
                    .get("/api/get/follow", { params: { userId: userData.id } })
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
            }
        };
        f();
    }, [userData]);
    //名前変更差踏みっと
    const onChangeName = () => {
        if (newUserName === "") {
            return;
        }
        axios
            .post("/api/edit/user/name", {
                id: userData && userData.id,
                name: newUserName,
                profile_image: newProfileImage,
                self_introduction: newSelfIntroduction
            })
            .then(res => {
                dispatch(login_user(res.data));
                setUser(res.data);
                setIsEditMode(false);
            })
            .catch(error => {
                console.log(error);
            });
    };
    const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        var files = e.target.files;

        const image_url = files && window.URL.createObjectURL(files[0]);
        image_url && setNewProfileImage(image_url);
    };
    const onSetUserData = () => {
        if (user) {
            setIsEditMode(true);
            console.log("aaaa");
            setNewUserName(user.name);

            setNewProfileImage(user.profile_image);
            user.self_introduction &&
                setNewSelfIntroduction(user.self_introduction);
            console.log(newProfileImage);
        }
    };
    return (
        <div>
            {user && (
                <>
                    名前::
                    {isEditMode ? (
                        <>
                            <input
                                type="file"
                                onChange={e => onChangeFile(e)}
                            />
                            <img src={newProfileImage} />
                            <input
                                type="text"
                                value={newUserName}
                                onChange={e => setNewUserName(e.target.value)}
                            />
                            <input
                                type="text"
                                value={newSelfIntroduction}
                                onChange={e =>
                                    setNewSelfIntroduction(e.target.value)
                                }
                            />
                            <button onClick={onChangeName}>送信</button>
                        </>
                    ) : (
                        <>
                            <img src={user.profile_image} />
                            <p>{user.name}</p>
                            <p>{user.self_introduction}</p>
                            <button onClick={onSetUserData}>編集</button>
                        </>
                    )}
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
