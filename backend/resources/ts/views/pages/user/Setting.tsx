import axios from "axios";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { RootState } from "../../../store";
import { login_user, logout_user } from "../../../store/counter/user/action";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import SettingsIcon from "@material-ui/icons/Settings";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from "@material-ui/core";
import { csrf_token } from "../../..";

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    },
    buttonContainer: {
        display: "flex",
        //flexDireciton: "column",
        justifyContent: "space-around"
    }
}));
function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const Setting = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const user = useSelector((state: RootState) => state.user.user);
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(true);
    const handleClickOpen = () => {
        if (user)
            if (user.name === "テストユーザー") {
                setIsSuccess(false);
                setMessage("テストユーザーではアカウントを削除できません");
                handleSnackBarClickOpen();
                return;
            }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleSnackBarClickOpen = () => {
        setSnackBarOpen(true);
    };

    const handleSnackBarClose = () => {
        setSnackBarOpen(false);
    };
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
    //ユーザー削除
    const onDeleteUser = async () => {
        if (user) {
            await axios
                .post("/api/delete/user", { user_id: user.id })
                .then(() => {
                    dispatch(logout_user());
                    history.push("/", { message: "削除に成功しました" });
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            history.push("/register");
        }
    };

    const onResetPassword = async (e: any) => {
        e.preventDefault();

        if (user) {
            if (user.name === "テストユーザー") {
                setIsSuccess(false);
                setMessage("テストユーザーではパスワードを変更できません");
                handleSnackBarClickOpen();
                return;
            }
            const email = user.email;
            await axios
                .post("/password/email", { email, _token: csrf_token })
                .then(() => {
                    setIsSuccess(true);
                    setMessage(
                        "あなたのメールアドレスにリセット用のメールを送信しました"
                    );
                    handleSnackBarClickOpen();
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            history.push("/register");
        }
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
                    一度削除したアカウントは二度と戻りません。本当によろしいでしょうか？
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    color="primary"
                    className={classes.button}
                >
                    キャンセル
                </Button>
                <Button
                    onClick={onDeleteUser}
                    variant="outlined"
                    color="secondary"
                    autoFocus
                    className={classes.button}
                >
                    削除
                </Button>
            </DialogActions>
        </Dialog>
    );
    return (
        <>
            <Helmet>
                <title>設定 | ゆうあるえる</title>
            </Helmet>
            <Typography component="h1" variant="h5">
                <SettingsIcon />
                ユーザー設定
            </Typography>
            <div className={classes.buttonContainer}>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={onResetPassword}
                >
                    パスワードリセット
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleClickOpen}
                    color="secondary"
                    startIcon={<DeleteIcon />}
                >
                    アカウント削除
                </Button>
            </div>
            {dialog}
            <Snackbar
                open={snackBarOpen}
                autoHideDuration={6000}
                onClose={handleSnackBarClose}
            >
                <Alert
                    onClose={handleSnackBarClose}
                    severity={isSuccess ? "success" : "warning"}
                >
                    {message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Setting;
