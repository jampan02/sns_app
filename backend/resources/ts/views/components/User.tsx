import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory, useLocation } from "react-router";
import { login_user } from "../../store/counter/user/action";
import { RootState } from "../../store";
import axios from "axios";
import { FOLLOW, LIKE, MIXED_POST_DATA, POST, USER } from "../../utils/type";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Hidden from "@material-ui/core/Hidden";
import AppBar from "@material-ui/core/AppBar";
import CameraIcon from "@material-ui/icons/PhotoCamera";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import InfiniteScroll from "react-infinite-scroller";
import Avatar from "@material-ui/core/Avatar";
import CardActions from "@material-ui/core/CardActions";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
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
    followContainer: {
        display: "flex",
        justifyContent: "space-between"
    }
}));
type FollowLength = {
    followeeLength: number;
    followerLength: number;
};
type Props = {
    user: USER;
    isLoginUser: boolean;
};
const Users: React.FC<Props> = ({ user, isLoginUser }) => {
    const classes = useStyles();
    const myUserId = useSelector((state: RootState) => state.user.user?.id);
    const history = useHistory();
    const [followLength, setFollowLength] = useState<FollowLength>({
        followeeLength: 0,
        followerLength: 0
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [isFollow, setIsFollow] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [newUserName, setNewUserName] = useState("");
    const [newSelfIntroduction, setNewSelfIntroduction] = useState("");
    const [newProfileImage, setNewProfileImage] = useState("");
    const params: { id: string } = useParams();
    const id = params.id;
    const dispatch = useDispatch();
    const [isFetchingUser, setIsFetchingUser] = useState(true);
    useEffect(() => {
        const f = async () => {
            if (!isLoginUser) {
                //Poster画面の場合

                await axios
                    .get("/api/get/follow", { params: { userId: id } })
                    .then(res => {
                        setFollowLength({
                            followeeLength: res.data.followee,
                            followerLength: res.data.follower
                        });
                    })
                    .catch(error => {
                        console.log(error);
                    });
                //ログインしてるか
                const getIsLogin = async (uid: any = myUserId) => {
                    await axios
                        .get("/api/get/isfollow", {
                            params: { followee: uid, follower: id }
                        })
                        .then(res => {
                            console.log("res.data=", res.data);
                            if (res.data === "yes") {
                                setIsFollow(true);
                            } else {
                                setIsFollow(false);
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                };
                if (!myUserId) {
                    await axios.get("/json").then(res => {
                        if (res.data) {
                            dispatch(login_user(res.data));
                            console.log("user=", res.data);
                            getIsLogin(res.data.id);
                        }
                    });
                } else {
                    getIsLogin();
                }
                setIsFetchingUser(false);
            } else {
                //Login_Userの場合
                await axios
                    .get("/api/get/follow", { params: { userId: user.id } })
                    .then(res => {
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
    }, []);
    const onFollow = (targetId: number) => {
        console.log("t=", targetId, "from=", myUserId);
        if (myUserId) {
            axios
                .post("/api/add/follow", {
                    followee: myUserId,
                    follower: targetId
                })
                .then(res => {
                    setFollowLength({
                        followeeLength: res.data.followee,
                        followerLength: res.data.follower
                    });
                    setIsFollow(true);
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            history.push("/register");
        }
    };
    //フォロー解除関数
    const onRemoveFollow = (targetId: number) => {
        if (myUserId) {
            axios
                .post("/api/del/follow", {
                    followee: myUserId,
                    follower: targetId
                })
                .then(res => {
                    setFollowLength({
                        followeeLength: res.data.followee,
                        followerLength: res.data.follower
                    });
                    setIsFollow(false);
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            history.push("/register");
        }
    };
    const isCanFollow = (userId: number) => {
        console.log("canFollow=", myUserId, userId);
        if (myUserId) {
            if (userId === myUserId) {
                return null;
            }
        }
        if (isFollow) {
            console.log("followd");
            return (
                <Button
                    disabled={isFetchingUser ? true : false}
                    variant="contained"
                    color="primary"
                    onClick={() => onRemoveFollow(userId)}
                >
                    フォローはずす
                </Button>
            );
        } else {
            console.log("not followd");
            return (
                <Button
                    disabled={isFetchingUser ? true : false}
                    variant="contained"
                    color="primary"
                    onClick={() => onFollow(userId)}
                >
                    フォローする
                </Button>
            );
        }
    };

    const onSetUserData = () => {
        if (user) {
            console.log(user.profile_image);
            setIsEditMode(true);

            setNewUserName(user.name);

            setNewProfileImage(user.profile_image);
            user.self_introduction &&
                setNewSelfIntroduction(user.self_introduction);
        }
    };
    const onFileChange = (e: any) => {
        const files = e.target.files;
        console.log(files);
        if (files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (e: any) => {
                setNewProfileImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const getEditMode = () => {
        if (isEditMode) {
            return (
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
                                onChange={e => {
                                    onFileChange(e);
                                }}
                            />
                            <label htmlFor="icon-button-file">
                                <IconButton color="primary" component="span">
                                    <Avatar
                                        alt="image"
                                        src={newProfileImage}
                                        className={classes.editAvatar}
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
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => setNewUserName(e.target.value)}
                        />
                    </div>
                    <TextField
                        name="self_introduction"
                        defaultValue={newSelfIntroduction}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setNewSelfIntroduction(e.target.value)
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
            );
        } else {
            return (
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

                    <Typography className={classes.introductionText}>
                        {user.self_introduction}
                    </Typography>
                    {user.name !== "テストユーザー" && (
                        <CardActions className={classes.cardAction}>
                            <Button variant="contained" onClick={onSetUserData}>
                                編集
                            </Button>
                        </CardActions>
                    )}
                </>
            );
        }
    };
    return (
        <Grid item xs={12} className={classes.grid}>
            <Card>
                {isLoginUser ? (
                    <CardContent className={classes.cardContent}>
                        {getEditMode()}
                    </CardContent>
                ) : (
                    <CardContent className={classes.cardContent}>
                        <div className={classes.avatarContainer}>
                            <Avatar
                                alt="image"
                                src={user.profile_image}
                                className={classes.large}
                            />
                            <Typography
                                variant="h4"
                                gutterBottom
                                className={classes.nameText}
                            >
                                {user.name}
                            </Typography>
                        </div>
                        <Typography className={classes.introductionText}>
                            {user.self_introduction}
                        </Typography>
                    </CardContent>
                )}

                <CardActions className={classes.followContainer}>
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
                    {isCanFollow(user.id)}
                </CardActions>
            </Card>
        </Grid>
    );
};

export default Users;
