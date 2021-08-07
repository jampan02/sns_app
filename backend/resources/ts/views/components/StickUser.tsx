import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router";
import { RootState } from "../../store";
import axios from "axios";
import { FOLLOW, LIKE, MIXED_POST_DATA, POST, USER } from "../../utils/type";
import { Link } from "react-router-dom";
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
import { useLocation } from "react-router";
import queryString from "query-string";
import { login_user } from "../../store/counter/user/action";
import Alert from "@material-ui/lab/Alert";
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
    },
    errorMessage: {
        marginTop: "10px"
    }
}));
type DATA = {
    user: USER;
    follow?: FOLLOW;
};
type Props = {
    path: string;
    isSearchResult: boolean;
    q?: string;
    targetId?: string;
};
const StickUser: React.FC<Props> = ({ path, isSearchResult, q, targetId }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const user = useSelector((state: RootState) => state.user.user);
    const [results, setResults] = useState<DATA[]>([]);
    const location = useLocation();
    const history = useHistory();
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [uid, setUid] = useState<number | undefined>();
    const [isFetchingUser, setIsFetchingUser] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
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
                        setIsFetchingUser(false);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
            setIsFetchingUser(false);
        };
        f();
    }, []);
    //フォロー関数
    const onFollow = async (targetId: number) => {
        if (user) {
            await axios
                .post("/api/add/follow/search", {
                    followee: user.id,
                    follower: targetId
                })
                .then(res => {
                    const follow = res.data as FOLLOW;
                    setResults(
                        results.map((result, i) => {
                            if (result.user.id === targetId) {
                                const newResult: DATA = {
                                    user: result.user,
                                    follow
                                };
                                return newResult;
                            } else {
                                return result;
                            }
                        })
                    );
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            history.push("/register");
        }
    };
    //フォロー解除関数
    const onRemoveFollow = async (targetId: number) => {
        if (user) {
            await axios
                .post("/api/del/follow/search", {
                    followee: user.id,
                    follower: targetId
                })
                .then(res => {
                    setResults(
                        results.map((result, i) => {
                            if (result.user.id === targetId) {
                                const newResult: DATA = {
                                    user: result.user
                                };
                                return newResult;
                            } else {
                                return result;
                            }
                        })
                    );
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            history.push("/register");
        }
    };
    const followButton = (result: DATA) => {
        if (user) {
            if (result.follow) {
                return (
                    <Button
                        disabled={isFetchingUser ? true : false}
                        variant="contained"
                        color="primary"
                        onClick={() => onRemoveFollow(result.user.id)}
                    >
                        フォローはずす
                    </Button>
                );
            } else if (user.id === result.user.id) {
                //同一アバターの場合
                return null;
            } else {
                return (
                    <Button
                        disabled={isFetchingUser ? true : false}
                        variant="contained"
                        color="primary"
                        onClick={() => onFollow(result.user.id)}
                    >
                        フォローする
                    </Button>
                );
            }
        } else {
            //非ログイン
            return (
                <Button
                    disabled={isFetchingUser ? true : false}
                    variant="contained"
                    color="primary"
                    onClick={() => history.push("/register")}
                >
                    フォローする
                </Button>
            );
        }
    };

    //項目を読み込むときのコールバック
    const loadMore = async (page: number) => {
        console.log("pageIs=", page);
        setIsFetching(true);
        let data: DATA;
        if (isSearchResult) {
            data = await axios
                .get(path, {
                    params: { q, number: page, user_id: user?.id }
                })
                .then(res => {
                    return res.data;
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            data = await axios
                .get(path, {
                    params: {
                        number: page,
                        targetId,
                        user_id: user?.id
                    }
                })
                .then(res => {
                    return res.data;
                })
                .catch(error => {
                    console.log(error);
                });
        }

        //データ件数が0件の場合、処理終了
        if (!data) {
            console.log("no data");
            //最初でいきなり情報が無かった場合、エラーメッセージを出力する
            if (page === 1) {
                console.log("no user");
                setErrorMessage("ユーザーが見つかりませんでした");
            }
            setHasMore(false);
            return;
        }
        //取得データをリストに追加*
        console.log("data=", data);
        setResults([...results, data]);
        setIsFetching(false);
    };
    return (
        <>
            {errorMessage && (
                <Alert severity="error" className={classes.errorMessage}>
                    {errorMessage}
                </Alert>
            )}
            <InfiniteScroll
                loadMore={loadMore} //項目を読み込む際に処理するコールバック関数
                hasMore={!isFetching && user && hasMore} // isFetchingを判定条件に追加
            >
                <Grid container>
                    {results[0] &&
                        results.map((result, i) => {
                            return (
                                <Grid
                                    item
                                    key={i}
                                    xs={12}
                                    className={classes.grid}
                                >
                                    <Card className={classes.card}>
                                        <Link
                                            to={`/${result.user.name}/user/${result.user.id}`}
                                        >
                                            <CardContent
                                                className={classes.cardContent}
                                            >
                                                <Avatar
                                                    alt="image"
                                                    src={
                                                        result.user
                                                            .profile_image
                                                    }
                                                />
                                                <Typography>
                                                    {result.user.name}
                                                </Typography>
                                            </CardContent>
                                        </Link>
                                        <CardActions>
                                            {followButton(result)}
                                        </CardActions>
                                    </Card>
                                </Grid>
                            );
                        })}
                </Grid>
            </InfiniteScroll>
        </>
    );
};

export default StickUser;
