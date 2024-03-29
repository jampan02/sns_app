import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useHistory } from "react-router";
import { RootState } from "../../../store/index";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Hidden from "@material-ui/core/Hidden";
import CardActions from "@material-ui/core/CardActions";
import Alert from "@material-ui/lab/Alert";
import { checkIsAuth } from "../../../store/api/api";
import { login_user } from "../../../store/counter/user/action";
import { Helmet } from "react-helmet";
const useStyles = makeStyles({
    card: {
        diplay: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    cardContent: {
        display: "flex",
        flexDirection: "column"
    },
    cardDetails: {
        flex: 1
    },
    cardMedia: {
        width: 160
    },
    text: {
        // marginBottom: "10px"
    },
    button: {
        diplay: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "15px"
    },
    errorMessage: {
        marginTop: "10px"
    }
});

const Create = () => {
    const classes = useStyles();
    const history = useHistory();
    const [body, setBody] = useState("");
    const [url, setUrl] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [error, setError] = useState("");
    const user = useSelector((state: RootState) => state.user.user);
    const dispatch = useDispatch();

    useEffect(() => {
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
    const onCreatePost = async () => {
        if (url === "") {
            setErrorMessage("URLは必須です");
            return;
        }
        if (body.length >= 255) {
            setErrorMessage("テキストは255文字以内にしてください");
            return;
        }
        if (user) {
            const data = {
                url,
                body,
                user_id: user.id
            };
            await axios
                .post("/api/add", data)
                .then(res => {
                    history.push("/");
                })
                .catch(error => {
                    console.log(error);
                    setError("このサイトは投稿できません");
                });
        }
    };
    return (
        <>
            <Helmet>
                <title>投稿画面 | ゆうあるえる</title>
            </Helmet>
            <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                    <TextField
                        id="standard-basic"
                        label="リンク"
                        onChange={e => setUrl(e.target.value)}
                        multiline
                        autoFocus={true}
                        className={classes.text}
                    />
                    <TextField
                        id="standard-multiline-static"
                        label="どんなサイト？"
                        multiline
                        rows={4}
                        onChange={e => setBody(e.target.value)}
                        className={classes.text}
                    />
                </CardContent>
                {errorMessage && (
                    <Alert severity="error" className={classes.errorMessage}>
                        {errorMessage}
                    </Alert>
                )}
                {error && (
                    <Alert severity="error" className={classes.errorMessage}>
                        {error}
                    </Alert>
                )}

                <CardActions className={classes.button}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onCreatePost}
                    >
                        投稿
                    </Button>
                </CardActions>
            </Card>
        </>
    );
};

export default Create;
