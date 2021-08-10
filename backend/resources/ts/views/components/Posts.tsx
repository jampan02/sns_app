import React, { useEffect, useState } from "react";
import axios from "axios";
import { LIKE, MIXED_POST_DATA } from "../../utils/type";
import { Link } from "react-router-dom";
import { RootState } from "../../store";
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
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import IconButton from "@material-ui/core/IconButton";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import { Helmet } from "react-helmet";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { login_user } from "../../store/counter/user/action";
import Alert from "@material-ui/lab/Alert";
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
    },
    errorMessage: {
        marginTop: "10px"
    }
}));
type Props = {
    path: string;
    user_id?: number;
    q?: string;
    defaultCurrency?: string;
};

const currencies = [
    {
        value: "followee",
        label: "フォロー中のユーザーの投稿を見る"
    },
    {
        value: "all",
        label: "全ての投稿を見る"
    },
    {
        value: "liked",
        label: "いいねした投稿を見る"
    }
];
const Posts: React.FC<Props> = ({ path, user_id, q, defaultCurrency }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector((state: RootState) => state.user.user);
    const [posts, setPosts] = useState<MIXED_POST_DATA[]>([]);
    const [followeePosts, setFolloweePosts] = useState<MIXED_POST_DATA[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [currency, setCurrency] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isFetchingUser, setIsFetchingUser] = useState(true);
    useEffect(() => {
        const f = async () => {
            if (!user) {
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
            setIsFetchingUser(false);
        };
        f();
        defaultCurrency && setCurrency(defaultCurrency);
    }, []);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === "followee") {
            //「フォロー中のユーザー」を選択した場合
            if (user) {
                history.push("/followee/posts");
            } else {
                history.push("register");
            }
        } else if (e.target.value === "liked") {
            if (user) {
                history.push("/liked/posts");
            } else {
                history.push("register");
            }
        } else {
            //「全て」を選択した場合
            history.push("/");
        }
    };

    const onAddLike = async (post_id: number) => {
        console.log("adddd");
        if (user) {
            const user_id = user.id;

            await axios
                .post("/api/add/like", {
                    user_id,
                    post_id
                })
                .then(res => {
                    const likedPost: MIXED_POST_DATA = res.data;
                    const likedPostId: number = res.data.post.id;
                    console.log("likedPost=", likedPost);
                    setPosts(
                        posts.map(post => {
                            if (post.post.id === likedPostId) {
                                return likedPost;
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
    const onRemoveLike = async (post_id: number) => {
        if (user) {
            const user_id = user.id;
            await axios
                .post("/api/del/like", {
                    user_id,
                    post_id
                })
                .then(res => {
                    const likedPost: MIXED_POST_DATA = res.data;
                    const likedPostId: number = res.data.post.id;
                    console.log("likedPost=", likedPost);
                    setPosts(
                        posts.map(post => {
                            if (post.post.id === likedPostId) {
                                return likedPost;
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
    const loadMore = async (page: number) => {
        console.log("loadMore!");
        setIsFetching(true);
        let data: MIXED_POST_DATA;
        if (user_id) {
            data = await axios
                .get(path, { params: { number: page, user_id } })
                .then(res => {
                    const data = res.data;

                    return data;
                })
                .catch(error => {
                    console.log(error);
                });
        } else if (q) {
            data = await axios
                .get(path, { params: { number: page, q } })
                .then(res => {
                    const data = res.data;

                    return data;
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            data = await axios
                .get(path, { params: { number: page } })
                .then(res => {
                    const data = res.data;

                    return data;
                })
                .catch(error => {
                    console.log(error);
                });
        }

        //データ件数が0件の場合、処理終了
        if (!data) {
            setHasMore(false);
            //最初でいきなり情報が無かった場合、エラーメッセージを出力する
            if (page === 1) {
                console.log("no user");
                setErrorMessage("投稿が見つかりませんでした");
            }
            return;
        }
        //取得データをリストに追加*
        setPosts([...posts, data]);
        console.log(posts);
        setIsFetching(false);
    };

    return (
        <>
            {defaultCurrency && (
                <TextField
                    select
                    value={currency}
                    onChange={handleChange}
                    className={classes.selectBox}
                    disabled={isFetchingUser ? true : false}
                >
                    {currencies.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            )}
            {!user_id && errorMessage && (
                <Alert severity="error" className={classes.errorMessage}>
                    {errorMessage}
                </Alert>
            )}
            <InfiniteScroll
                loadMore={loadMore} //currencyの状態によって、表示する項目変更
                hasMore={!isFetching && hasMore} // isFetchingを判定条件に追加
            >
                <Grid container>
                    {/* 読み込み最中に表示する項目 */}
                    {posts[0] &&
                        posts.map(post => {
                            console.log("aaa");
                            return (
                                <Grid
                                    item
                                    key={post.post.id}
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
                                                                    post.post.id
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
                                                                    post.post.id
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
        </>
    );
};

export default Posts;
