import axios from "axios";
import React, { useEffect, ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { FOLLOW, MIXED_POST_DATA, POST, USER } from "../../utils/type";
import { useHistory, useLocation } from "react-router";
import queryString from "query-string";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { CardActionAreaProps } from "@material-ui/core";
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
import { getIsLogin } from "../../store/api/api";
//import Link from '@material-ui/core/Link';
import { login_user } from "../../store/counter/user/action";
import { Helmet } from "react-helmet";
import StickUser from "../components/StickUser";
const useStyles = makeStyles(theme => ({
    card: {
        display: "flex",
        justifyContent: "space-between"
    },
    cardContent: {
        display: "flex"
    },
    grid: {
        marginBottom: "10px"
    }
}));
type DATA = {
    user: USER;
    follow?: FOLLOW;
};

const UserResult = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const user = useSelector((state: RootState) => state.user.user);
    const [results, setResults] = useState<DATA[]>([]);
    const location = useLocation();
    const history = useHistory();
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const parsed = queryString.parse(location.search);
    const query = parsed.q as string;

    return (
        <>
            <Helmet>
                <title>
                    "{query}"に関するユーザーの検索結果 | ゆうあるえる
                </title>
            </Helmet>
            <StickUser
                path="/api/get/user/search"
                isSearchResult={true}
                q={query}
            />
        </>
    );
};

export default UserResult;
