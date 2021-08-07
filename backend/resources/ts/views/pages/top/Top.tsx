import React, { useEffect, useState } from "react";
import axios from "axios";
import { LIKE, MIXED_POST_DATA } from "../../../utils/type";
import { Link } from "react-router-dom";
import { RootState } from "../../../store";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";
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
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import Posts from "../../components/Posts";
import Snackbar from "@material-ui/core/Snackbar";
import { Button } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
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
function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const Top: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector((state: RootState) => state.user.user);
    const [posts, setPosts] = useState<MIXED_POST_DATA[]>([]);
    const [followeePosts, setFolloweePosts] = useState<MIXED_POST_DATA[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [currency, setCurrency] = useState("all");
    const [message, setMessage] = useState("");
    type Location = {
        data?: { message: string };
    };
    const location: any = useLocation();

    useEffect(() => {
        if (location.state !== undefined) {
            console.log(location.state);
            setMessage(location.state.message);
            handleClick();
        }
    }, []);

    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    return (
        <>
            <Helmet>
                <title>トップページ | ゆうあるえる</title>
            </Helmet>

            <Posts path="/api/get/post/scroll" defaultCurrency="all" />
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    {message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Top;
