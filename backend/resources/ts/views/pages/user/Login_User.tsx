import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { RootState } from "../../../store";
import axios from "axios";
import { LIKE, MIXED_POST_DATA, USER } from "../../../utils/type";
import { Link } from "react-router-dom";
import { login_user } from "../../../store/counter/user/action";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import InfiniteScroll from "react-infinite-scroller";
import Avatar from "@material-ui/core/Avatar";
import CardActions from "@material-ui/core/CardActions";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import { Helmet } from "react-helmet";
const useStyles = makeStyles(theme => ({
    icon: {
        marginRight: theme.spacing(2)
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6)
    },
    heroButtons: {
        marginTop: theme.spacing(4)
    },
    cardGrid: {
        paddingRight: theme.spacing(15),
        paddingLeft: theme.spacing(15)
    },
    card: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        marginBottom: "10px",
        "&:hover": {
            backgroundColor: "rgba(0,0,0,0.03)"
        }
    },
    cardUser: {},
    /*cardMedia: {
        paddingTop: "56.25%" // 16:9
    },
    cardContent: {
        display: "flex",
        flexDirection: "column",
        marginBottom: "10px"
    },*/
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6)
    },
    large: {
        width: theme.spacing(15),
        height: theme.spacing(15)
    },
    followLength: {
        display: "flex"
    },
    editNameText: {
        marginBottom: "10px"
    },
    editIntroductionText: {},
    nameText: {
        marginBottom: "20px"
    },
    introductionText: {
        marginLeft: "5px"
    },
    cardAction: {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-start"
    },
    textContainer: {
        display: "flex",
        marginLeft: "10px",
        flexDirection: "column"
    },
    avatarContainer: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",

        alignItems: "center"
    },
    errorMessage: {
        marginTop: "10px"
    },
    input: {
        display: "none"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        marginBottom: "10px"
    },
    editAvatar: {
        width: theme.spacing(15),
        height: theme.spacing(15),
        "&:hover": {
            opacity: 0.5
        }
    },
    profileContent: {
        display: "flex",
        marginBottom: "0.5rem"
    },
    grid: {
        marginBottom: "10px"
    },
    link: {
        textDecoration: "none",
        "&:hover": {
            textDecoration: "none"
        }
    },
    siteName: {
        marginBottom: "0.5rem",
        color: "rgb(83, 100, 113)"
    },
    cardContent: {
        flexGrow: 1
    },
    cardMedia: {
        paddingTop: "56.25%", // 16:9
        marginBottom: "0.5rem",
        "&:hover": {
            opacity: 0.3
        }
    },

    cardMediaContainer: {},
    profileContainer: {
        display: "flex"
    },
    data: {},
    dataContainer: {
        display: "flex",
        justifyContent: "flex-end",
        fontSize: "0.8rem",
        color: "rgb(83, 100, 113)"
    },
    body: {
        paddingLeft: "1rem",
        paddingRight: "1rem",
        marginBottom: "0.5rem"
    },
    avatar: {
        marginRight: "1rem"
    },
    userName: {
        color: "black"
    }
}));
type FollowLength = {
    followeeLength: number;
    followerLength: number;
};

const Login_User = () => {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const userData = useSelector((state: RootState) => state.user.user);
    const [isFetching, setIsFetching] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [user, setUser] = useState<USER>();
    const [posts, setPosts] = useState<MIXED_POST_DATA[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [followLength, setFollowLength] = useState<FollowLength>({
        followerLength: 0,
        followeeLength: 0
    });

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
                //該当のユーザーの、フォロー・フォロワー数取得
                await axios
                    .get("/api/get/follow", { params: { userId: userData.id } })
                    .then(res => {
                        setFollowLength({
                            followeeLength: res.data.followee,
                            followerLength: res.data.follower
                        });
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else {
                await axios
                    .get("/json")
                    .then(res => {
                        if (res.data) {
                            dispatch(login_user(res.data));
                        } else {
                            history.push("/register");
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        };
        f();
    }, [userData]);
    //名前変更差踏みっと

    const onSetUserData = () => {
        if (user) {
            setIsEditMode(true);

            setNewUserName(user.name);

            setNewProfileImage(user.profile_image);
            user.self_introduction &&
                setNewSelfIntroduction(user.self_introduction);
        }
    };
    //ロード中に表示する項目
    const loader = (
        <div className="loader" key={0}>
            Loading ...
        </div>
    );
    //項目を読み込むときのコールバック
    const loadMore = async (page: number) => {
        setIsFetching(true);
        if (user) {
            const data: MIXED_POST_DATA = await axios
                .get("/api/get/post/scroll/user", {
                    params: { number: page, user_id: user.id }
                })
                .then(res => {
                    const data = res.data;

                    return data;
                })
                .catch(error => {
                    console.log(error);
                });

            //データ件数が0件の場合、処理終了
            if (!data) {
                setHasMore(false);
                return;
            }
            //取得データをリストに追加*
            setPosts([...posts, data]);
            setIsFetching(false);
        }
    };
    const onAddLike = (post_id: number, index: number) => {
        if (user) {
            const user_id = user.id;

            const indexNumber = index;
            axios
                .post("/api/add/like", {
                    user_id,
                    post_id
                })
                .then(res => {
                    setPosts(
                        posts.map((post, i) => {
                            if (i === indexNumber) {
                                return res.data;
                            } else {
                                return post;
                            }
                        })
                    );
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
    const getDate = (date: string) => {
        const toDate = new Date(date);
        const month = toDate.getMonth() + 1;
        const day = toDate.getDate();
        return (
            <Typography>
                {month}月 {day}日
            </Typography>
        );
    };
    return (
        <div>
            <Helmet>
                <title>ユーザーページ | ゆうあるえる</title>
            </Helmet>
            {user && (
                <Grid item xs={12} className={classes.grid}>
                    <Card className={classes.cardUser}>
                        <CardContent className={classes.cardContent}>
                            {isEditMode ? (
                                <form
                                    action={`/api/edit/user/name?id=${user.id}`}
                                    method="post"
                                    encType="multipart/form-data"
                                    className={classes.form}
                                >
                                    <div className={classes.avatarContainer}>
                                        <CardActions>
                                            <input
                                                accept="image/*"
                                                name="image"
                                                type="file"
                                                id="icon-button-file"
                                                className={classes.input}
                                                multiple
                                            />
                                            <label htmlFor="icon-button-file">
                                                <IconButton
                                                    color="primary"
                                                    component="span"
                                                >
                                                    <Avatar
                                                        alt="image"
                                                        src={newProfileImage}
                                                        className={
                                                            classes.editAvatar
                                                        }
                                                    />
                                                </IconButton>
                                            </label>
                                        </CardActions>

                                        <TextField
                                            className={classes.editNameText}
                                            name="name"
                                            type="text"
                                            defaultValue={newUserName}
                                            onChange={(
                                                e: React.ChangeEvent<
                                                    HTMLInputElement
                                                >
                                            ) => setNewUserName(e.target.value)}
                                        />
                                    </div>
                                    <TextField
                                        name="self_introduction"
                                        className={classes.editIntroductionText}
                                        defaultValue={newSelfIntroduction}
                                        onChange={(
                                            e: React.ChangeEvent<
                                                HTMLInputElement
                                            >
                                        ) =>
                                            setNewSelfIntroduction(
                                                e.target.value
                                            )
                                        }
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                    />
                                    {errorMessage && (
                                        <Alert
                                            severity="error"
                                            className={classes.errorMessage}
                                        >
                                            {errorMessage}
                                        </Alert>
                                    )}
                                    <CardActions className={classes.cardAction}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                        >
                                            変更
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => setIsEditMode(false)}
                                        >
                                            閉じる
                                        </Button>
                                    </CardActions>
                                </form>
                            ) : (
                                <>
                                    <div className={classes.avatarContainer}>
                                        <Avatar
                                            alt="image"
                                            src={user.profile_image}
                                            className={classes.large}
                                        />

                                        <Typography
                                            className={classes.nameText}
                                            variant="h4"
                                            gutterBottom
                                        >
                                            {user.name}
                                        </Typography>
                                    </div>

                                    <Typography
                                        className={classes.introductionText}
                                    >
                                        {user.self_introduction}
                                    </Typography>
                                    <CardActions className={classes.cardAction}>
                                        <Button
                                            variant="contained"
                                            onClick={onSetUserData}
                                        >
                                            編集
                                        </Button>
                                    </CardActions>
                                </>
                            )}

                            <div className={classes.followLength}>
                                <Link to={`/${user.name}/followee/${user.id}`}>
                                    <Typography>
                                        フォロー数:
                                        {followLength.followeeLength}
                                    </Typography>
                                </Link>
                                <Link to={`/${user.name}/follower/${user.id}`}>
                                    <Typography>
                                        フォロワー数:
                                        {followLength.followerLength}
                                    </Typography>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
            )}
            <InfiniteScroll
                loadMore={loadMore} //項目を読み込む際に処理するコールバック関数
                hasMore={!isFetching && user && hasMore} // isFetchingを判定条件に追加
                loader={loader}
                useWindow={false}
            >
                <Grid container>
                    {/* 読み込み最中に表示する項目 */}
                    {posts[0] &&
                        posts.map((post, i) => {
                            return (
                                <Grid
                                    item
                                    key={i}
                                    xs={12}
                                    className={classes.grid}
                                >
                                    <Link
                                        to={{
                                            pathname: `/${post.user.name}/post/${post.post.id}`,
                                            state: {
                                                post: post.post,
                                                user: post.user,
                                                likes: post.likes
                                            }
                                        }}
                                        className={classes.link}
                                    >
                                        <Card className={classes.card}>
                                            <CardContent
                                                className={classes.cardContent}
                                            >
                                                <object>
                                                    <div
                                                        className={
                                                            classes.profileContent
                                                        }
                                                    >
                                                        <Link
                                                            to={{
                                                                pathname: `/${post.user.name}/user/${post.user.id}`,
                                                                state: post.user
                                                            }}
                                                            className={
                                                                classes.profileContainer
                                                            }
                                                        >
                                                            <Avatar
                                                                alt="image"
                                                                src={
                                                                    post.user
                                                                        .profile_image
                                                                }
                                                                className={
                                                                    classes.avatar
                                                                }
                                                            />
                                                            <Typography
                                                                className={
                                                                    classes.userName
                                                                }
                                                            >
                                                                {post.user.name}
                                                            </Typography>
                                                        </Link>
                                                    </div>
                                                </object>
                                                <Typography
                                                    variant="h5"
                                                    component="h2"
                                                >
                                                    {post.post.title}
                                                </Typography>
                                                <Typography
                                                    className={classes.siteName}
                                                >
                                                    {post.post.site_name}
                                                </Typography>
                                                <object>
                                                    <div
                                                        className={
                                                            classes.cardMediaContainer
                                                        }
                                                        onClick={(e: any) => {
                                                            e.stopPropagation();
                                                            e.preventDefault();
                                                            window.open(
                                                                post.post.url
                                                            );
                                                        }}
                                                    >
                                                        <CardMedia
                                                            className={
                                                                classes.cardMedia
                                                            }
                                                            image={
                                                                post.post.image
                                                            }
                                                            title={
                                                                post.post.title
                                                            }
                                                        />
                                                    </div>
                                                </object>

                                                <Typography
                                                    className={classes.body}
                                                >
                                                    {post.post.body}
                                                </Typography>
                                                <div
                                                    className={
                                                        classes.dataContainer
                                                    }
                                                >
                                                    <CalendarTodayIcon />

                                                    {getDate(
                                                        post.post.updated_at
                                                    )}
                                                </div>
                                            </CardContent>

                                            <CardActions>
                                                <object>
                                                    {isLikedBefore(post) ? (
                                                        <IconButton
                                                            onClick={(
                                                                e: any
                                                            ) => {
                                                                e.stopPropagation();
                                                                e.preventDefault();
                                                                onRemoveLike(
                                                                    post.post
                                                                        .id,
                                                                    i
                                                                );
                                                            }}
                                                            color="primary"
                                                        >
                                                            <ThumbUpIcon />
                                                        </IconButton>
                                                    ) : (
                                                        <IconButton
                                                            onClick={(
                                                                e: any
                                                            ) => {
                                                                e.stopPropagation();
                                                                e.preventDefault();
                                                                onAddLike(
                                                                    post.post
                                                                        .id,
                                                                    i
                                                                );
                                                            }}
                                                        >
                                                            <ThumbUpIcon />
                                                        </IconButton>
                                                    )}
                                                    {post.likes.length}
                                                </object>
                                            </CardActions>
                                        </Card>
                                    </Link>
                                </Grid>
                            );
                        })}
                </Grid>
            </InfiniteScroll>
        </div>
    );
};

export default Login_User;
