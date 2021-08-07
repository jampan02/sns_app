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
import Posts from "../../components/Posts";
const useStyles = makeStyles(theme => ({
    selectBox: {
        marginBottom: "1rem"
    }
}));

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
        //パラメーターに則ったユーザー情報取得
        const f = async () => {
            if (!user) {
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
    }, []);
    if (user) {
        return (
            <>
                <Helmet>
                    <title>フォロー中のユーザーの投稿 | ゆうあるえる</title>
                </Helmet>
                <Posts
                    path="/api/get/post/scroll/followee"
                    user_id={user.id}
                    defaultCurrency="followee"
                />
            </>
        );
    } else {
        return null;
    }
};

export default FolloweePosts;
