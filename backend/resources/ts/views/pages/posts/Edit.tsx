import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router";
import { Link } from "react-router-dom";
import { RootState } from "../../../store";
import {
    COMMENT,
    LIKE,
    MIXED_POST_DATA,
    POST,
    USER
} from "../../../utils/type";
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
import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { checkIsAuth } from "../../../store/api/api";

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
    },
    deleteButton: {
        textAlign: "right"
    }
});
const Edit = () => {
    const classes = useStyles();
    const history = useHistory();
    const user = useSelector((state: RootState) => state.user);
    const location: {
        pathname: string;
        state: { post: POST; user: USER };
    } = useLocation();
    const [body, setBody] = useState("");
    const [url, setUrl] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const userData = location.state.user;
    const postData = location.state.post;
    useEffect(() => {
        if (user.user) {
            if (user.user.id === userData.id) {
                //本人確認

                setBody(postData.body);
                setUrl(postData.url);
            } else {
                history.push("/");
            }
        } else {
            history.push("/");
        }
    }, []);

    //削除機能
    const onDeletePost = async () => {
        handleClose();
        const id = postData.id;

        await axios
            .post("/api/del/post", { id })
            .then(res => {
                history.push("/");
            })
            .catch(error => {
                console.log(error);
            });
    };

    //編集機能
    const onEditPost = async () => {
        if (url === "") {
            setErrorMessage("URLは必須です");
            return;
        }
        if (body.length >= 255) {
            setErrorMessage("テキストは255文字以内にしてください");
            return;
        }
        await axios
            .post("/api/edit/post", { url, body, post_id: postData.id })
            .then(res => {
                history.push("/");
            })
            .catch(error => {
                console.log(error);
            });
    };
    const dialog = (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"本当に削除してよろしいですか？"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    内容：{postData.body}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    color="primary"
                >
                    いいえ
                </Button>
                <Button
                    onClick={onDeletePost}
                    variant="outlined"
                    color="secondary"
                    autoFocus
                >
                    はい
                </Button>
            </DialogActions>
        </Dialog>
    );
    return (
        <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
                <TextField
                    id="standard-basic"
                    label="リンク"
                    onChange={e => setUrl(e.target.value)}
                    autoFocus={true}
                    multiline
                    className={classes.text}
                    defaultValue={url}
                />
                <TextField
                    id="standard-multiline-static"
                    label="どんなサイト？"
                    multiline
                    rows={4}
                    onChange={e => setBody(e.target.value)}
                    className={classes.text}
                    defaultValue={body}
                />
            </CardContent>
            {errorMessage && (
                <Alert severity="error" className={classes.errorMessage}>
                    {errorMessage}
                </Alert>
            )}
            <CardActions className={classes.button}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onEditPost}
                >
                    更新
                </Button>
                <IconButton
                    aria-label="delete"
                    className={classes.deleteButton}
                    onClick={handleClickOpen}
                >
                    <DeleteIcon />
                </IconButton>
                {dialog}
            </CardActions>
        </Card>
    );
};

export default Edit;
