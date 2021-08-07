import axios from "axios";
import React, { useEffect, ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { LIKE, MIXED_POST_DATA, POST } from "../../utils/type";
import { useHistory, useLocation } from "react-router";
import queryString from "query-string";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import InfiniteScroll from "react-infinite-scroller";
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
//import Link from '@material-ui/core/Link';
import { getIsLogin } from "../../store/api/api";
import { login_user } from "../../store/counter/user/action";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import IconButton from "@material-ui/core/IconButton";
import { Helmet } from "react-helmet";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import Posts from "../components/Posts";
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
    }
}));
const PostResult = () => {
    const classes = useStyles();
    const user = useSelector((state: RootState) => state.user.user);
    const [posts, setPosts] = useState<MIXED_POST_DATA[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const location = useLocation();
    const history = useHistory();
    const parsed = queryString.parse(location.search);
    const query = parsed.q as string;

    const dispatch = useDispatch();
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
        };
        f();
    }, []);

    const loadMore = async (page: number) => {
        setIsFetching(true);
        const data: MIXED_POST_DATA = await axios
            .get("/api/get/post/search", { params: { number: page, q: query } })
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
    };
    return (
        <div>
            <Helmet>
                <title>"{query}"に関する投稿の検索結果 | ゆうあるえる</title>
            </Helmet>
            <Posts path="/api/get/post/search" q={query} />
        </div>
    );
};

export default PostResult;
