import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import { RootState } from "../../../store";
import {
    COMMENT,
    LIKE,
    MIXED_POST_DATA,
    POST,
    USER
} from "../../../utils/type";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CameraIcon from "@material-ui/icons/PhotoCamera";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import IconButton from "@material-ui/core/IconButton";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import CommentIcon from "@material-ui/icons/Comment";
import Alert from "@material-ui/lab/Alert";
import InfiniteScroll from "react-infinite-scroller";
import { login_user } from "../../../store/counter/user/action";
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
        marginBottom: "10px"
    },

    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6)
    },
    profileContent: {
        display: "flex",
        marginBottom: "0.5rem",
        justifyContent: "space-between"
    },
    grid: {
        marginBottom: "20px"
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
        flexGrow: 1,
        "&:last-child": {
            paddingBottom: "16px"
        }
    },
    cardMedia: {
        paddingTop: "56.25%", // 16:9
        marginBottom: "0.5rem"
    },
    hoverCardMedia: {
        paddingTop: "56.25%", // 16:9
        marginBottom: "0.5rem",
        opacity: 0.3,
        cursor: "pointer"
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
    },
    comment: {
        marginBottom: "0.5rem"
    },
    commentProfileContent: {
        display: "flex",
        marginBottom: "0.5rem"
    },
    errorMessage: {
        marginTop: "10px"
    },
    commentField: {
        marginBottom: "0.3rem"
    },
    commentFieldContainer: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        marginBottom: "1rem"
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "space-around"
    }
}));

type USERCOMMENT = {
    user: USER;
    comment: COMMENT;
};

const View = () => {
    const classes = useStyles();
    const history = useHistory();
    const user = useSelector((state: RootState) => state.user);
    const location: {
        pathname: string;
        state: MIXED_POST_DATA;
    } = useLocation();
    const [errorMessage, setErrorMessage] = useState("");
    const [likes, setLikes] = useState<LIKE[]>([]);
    const [comments, setComments] = useState<USERCOMMENT[]>([]);
    const [isOpenComment, setIsOpenComment] = useState(false);
    const [comment, setComment] = useState("");
    const params: { id: string } = useParams();
    const [post, setPost] = useState<POST>();
    const [postUser, setPostUser] = useState<USER>();
    const [isHover, setIsHover] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const id = params.id;
    const dispatch = useDispatch();
    useEffect(() => {
        const f = async () => {
            //直リンの場合
            if (!user.user) {
                //ログインされていない場合

                await axios
                    .get("/json")
                    .then(res => {
                        if (res.data) {
                            dispatch(login_user(res.data));
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
            if (!location.state) {
                await axios
                    .get("/api/get/post", { params: { id } })
                    .then(res => {
                        const data = res.data;

                        setPost(data.post);
                        setPostUser(data.user);
                        setLikes(data.likes);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else {
                //そうじゃない場合(通常の画面遷移)
                setPost(location.state.post);
                setPostUser(location.state.user);

                if (location.state.likes.length > 0) {
                    const locationLikes = location.state.likes;
                    setLikes(locationLikes);
                } else {
                    //likes取得
                    const postId = location.state.post.id;
                    await axios
                        .get("/api/get/likes/post_id", {
                            params: { post_id: postId }
                        })
                        .then(res => {
                            setLikes(res.data);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            }
        };
        f();
    }, []);
    //コメント送信機能
    const onAddComment = () => {
        if (comment === "") {
            setErrorMessage("コメントを入力してください");
            return;
        }
        if (comment.length >= 255) {
            setErrorMessage("コメントは255文字以内にしてください");
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
                    setIsOpenComment(false);
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            history.push("/register");
        }
    };
    const getDate = (date: string) => {
        const toDate = new Date(date);
        const month = toDate.getMonth() + 1;
        const day = toDate.getDate();
        const h = toDate.getHours() + 9;
        const year = toDate.getFullYear();
        const minutes = toDate.getMinutes();
        return (
            <Typography>
                {year}年　{month}月 {day}日　
                {h < 12 ? `午前${h}時` : `午後${h - 12}時`}
                {minutes}分
            </Typography>
        );
    };
    const getEditButton = () => {
        if (user.user) {
            if (postUser) {
                if (user.user.id === postUser.id) {
                    return (
                        <Link
                            to={{
                                pathname: `/${postUser.name}/edit/${postUser.id}`,
                                state: {
                                    post: post,
                                    user: postUser
                                }
                            }}
                        >
                            <Button variant="outlined">編集</Button>
                        </Link>
                    );
                }
            }
        } else {
        }
    };
    const onAddLike = (post_id: number) => {
        if (user.user) {
            const user_id = user.user.id;
            axios
                .post("/api/add/like/view", {
                    user_id,
                    post_id
                })
                .then(res => {
                    setLikes(res.data);
                })
                .catch(error => console.log(error));
        } else {
            history.push("/register");
        }
    };
    //いいね解除
    const onRemoveLike = (post_id: number) => {
        if (user.user) {
            const user_id = user.user.id;

            axios
                .post("/api/del/like/view", {
                    user_id,
                    post_id
                })
                .then(res => {
                    setLikes(res.data);
                });
        } else {
            history.push("/register");
        }
    };
    //いいねしたことあるか、
    const isLikedBefore = () => {
        const even = (like: LIKE) => user.user && like.user_id == user.user.id;
        const isLiked = likes.some(even);
        return isLiked;
    };
    //項目を読み込むときのコールバック
    const loadMore = async (page: number) => {
        setIsFetching(true);

        const data: USERCOMMENT = await axios
            .get("/api/get/comment", {
                params: { postId: location.state.post.id, number: page }
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
        setComments([...comments, data]);

        setIsFetching(false);
    };
    return (
        <>
            {postUser && post && (
                <>
                    <Helmet>
                        <title>{post.body} | ゆうあるえる</title>
                    </Helmet>

                    <Card className={classes.card}>
                        <CardContent className={classes.cardContent}>
                            <object>
                                <div className={classes.profileContent}>
                                    <Link
                                        to={{
                                            pathname: `/${postUser.name}/user/${postUser.id}`,
                                            state: postUser
                                        }}
                                        className={classes.profileContainer}
                                    >
                                        <Avatar
                                            alt="image"
                                            src={postUser.profile_image}
                                            className={classes.avatar}
                                        />
                                        <Typography
                                            className={classes.userName}
                                        >
                                            {postUser.name}
                                        </Typography>
                                    </Link>
                                    {user.user && getEditButton()}
                                </div>
                            </object>
                            <Typography variant="h5" component="h2">
                                {post.title}
                            </Typography>
                            <Typography className={classes.siteName}>
                                {post.site_name}
                            </Typography>
                            <object>
                                <div
                                    onMouseEnter={() => setIsHover(true)}
                                    onMouseLeave={() => setIsHover(false)}
                                    className={classes.cardMediaContainer}
                                    onClick={(e: any) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        window.open(post.url);
                                    }}
                                >
                                    <CardMedia
                                        className={
                                            isHover
                                                ? classes.hoverCardMedia
                                                : classes.cardMedia
                                        }
                                        image={post.image}
                                        title={post.title}
                                    />
                                </div>
                            </object>

                            <Typography className={classes.body}>
                                {post.body}
                            </Typography>
                            <div className={classes.dataContainer}>
                                <CalendarTodayIcon />

                                {getDate(post.updated_at)}
                            </div>
                        </CardContent>

                        <CardActions>
                            <object>
                                {isLikedBefore() ? (
                                    <IconButton
                                        onClick={(e: any) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            onRemoveLike(post.id);
                                        }}
                                        color="primary"
                                    >
                                        <ThumbUpIcon />
                                    </IconButton>
                                ) : (
                                    <IconButton
                                        onClick={(e: any) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            onAddLike(post.id);
                                        }}
                                    >
                                        <ThumbUpIcon />
                                    </IconButton>
                                )}
                                {likes.length}
                            </object>
                        </CardActions>
                    </Card>
                </>
            )}
            <InfiniteScroll
                loadMore={loadMore} //項目を読み込む際に処理するコールバック関数
                hasMore={!isFetching && hasMore} // isFetchingを判定条件に追加
            >
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant="h6" component="h3">
                            コメント一覧
                            <IconButton
                                color={isOpenComment ? undefined : "primary"}
                                aria-label="add a comment"
                                onClick={() =>
                                    setIsOpenComment(
                                        isOpenComment ? false : true
                                    )
                                }
                            >
                                <CommentIcon />
                            </IconButton>
                        </Typography>
                    </Grid>
                    {isOpenComment && (
                        <Grid
                            item
                            xs={12}
                            className={classes.commentFieldContainer}
                        >
                            <TextField
                                rows={4}
                                onChange={e => setComment(e.target.value)}
                                label="コメントを残す"
                                multiline
                                variant="outlined"
                                className={classes.commentField}
                            />
                            <div className={classes.buttonContainer}>
                                <Button
                                    onClick={onAddComment}
                                    variant="outlined"
                                    color="primary"
                                >
                                    送信
                                </Button>
                                <Button
                                    onClick={() => setIsOpenComment(false)}
                                    variant="outlined"
                                    color="secondary"
                                >
                                    閉じる
                                </Button>
                            </div>
                            {errorMessage && (
                                <Alert
                                    severity="error"
                                    className={classes.errorMessage}
                                >
                                    {errorMessage}
                                </Alert>
                            )}
                        </Grid>
                    )}

                    {comments[0] &&
                        comments.map((comment, i) => (
                            <Grid
                                item
                                key={i}
                                xs={12}
                                className={classes.comment}
                            >
                                <Card>
                                    <CardContent
                                        className={classes.cardContent}
                                    >
                                        <div
                                            className={
                                                classes.commentProfileContent
                                            }
                                        >
                                            <Link
                                                to={`/${comment.user.name}/user/${comment.user.id}`}
                                                className={
                                                    classes.profileContainer
                                                }
                                            >
                                                <Avatar
                                                    className={classes.avatar}
                                                    alt="image"
                                                    src={
                                                        comment.user
                                                            .profile_image
                                                    }
                                                />
                                                <Typography
                                                    className={classes.userName}
                                                >
                                                    {comment.user.name}
                                                </Typography>
                                            </Link>
                                        </div>
                                        <Typography className={classes.body}>
                                            {comment.comment.comment}
                                        </Typography>
                                        <div className={classes.dataContainer}>
                                            <CalendarTodayIcon />
                                            {getDate(
                                                comment.comment.updated_at
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                </Grid>
            </InfiniteScroll>
        </>
    );
};

export default View;
