import React, { useEffect, useState } from "react";
import axios from "axios";
import { LIKE, MIXED_POST_DATA } from "../../../utils/type";
import { Link } from "react-router-dom";
import { RootState } from "../../../store";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import InfiniteScroll from "react-infinite-scroller";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { login_user } from "../../../store/counter/user/action";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import IconButton from "@material-ui/core/IconButton";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import { Helmet } from "react-helmet";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert/Alert";
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

    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6)
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
        transition: ".3s",
        "&:hover": {
            opacity: 0.5
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
    },
    selectBox: {
        marginBottom: "1rem"
    }
}));
const currencies = [
    {
        value: "followee",
        label: "フォロー中のユーザーの投稿を見る"
    },
    {
        value: "all",
        label: "全ての投稿を見る"
    }
];

const FolloweePosts = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector((state: RootState) => state.user.user);
    const [posts, setPosts] = useState<MIXED_POST_DATA[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [currency, setCurrency] = useState("followee");
    const [endMessage, setEndMessage] = useState(false);
    useEffect(() => {
        const f = async () => {
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
        };
        f();
    }, []);
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
            <Typography className={classes.data}>
                {month}月 {day}日
            </Typography>
        );
    };
    //フォロー中のユーザーの投稿取得
    const loadMoreFolloweePost = async (page: number) => {
        if (user) {
            setIsFetching(true);
            const data: MIXED_POST_DATA = await axios
                .get("/api/get/post/scroll/followee", {
                    params: { number: page, user_id: user.id }
                })
                .then(res => {
                    const data = res.data;
                    if (data === "no followee") {
                        setEndMessage(true);
                        return;
                    }
                    return data;
                })
                .catch(error => {
                    console.log(error);
                });

            //データ件数が0件の場合、処理終了
            if (!data) {
                //しょっぱなからデータがない場合
                if (!posts[0]) {
                    setEndMessage(true);
                }
                setHasMore(false);

                return;
            }
            //取得データをリストに追加*
            setPosts([...posts, data]);

            setIsFetching(false);
        }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        history.push("/");
    };
    return (
        <>
            <Helmet>
                <title>フォロー中のユーザーの投稿 | ゆうあるえる</title>
            </Helmet>
            <TextField
                select
                value={currency}
                onChange={handleChange}
                className={classes.selectBox}
            >
                {currencies.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <InfiniteScroll
                loadMore={loadMoreFolloweePost} //currencyの状態によって、表示する項目変更
                hasMore={!isFetching && hasMore && Boolean(user)} // isFetchingを判定条件に追加
            >
                <Grid container>
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
            {endMessage && (
                <Alert severity="error">フォロー中のユーザーがいません</Alert>
            )}
        </>
    );
};

export default FolloweePosts;
