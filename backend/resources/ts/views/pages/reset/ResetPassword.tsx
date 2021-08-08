import axios from "axios";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { RootState } from "../../../store";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { csrf_token } from "../../..";
import { Container, CssBaseline } from "@material-ui/core";
function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    large: {
        width: theme.spacing(15),
        height: theme.spacing(15)
    },
    errorMessage: {
        marginTop: "10px"
    }
}));
const ResetPassword = () => {
    const classes = useStyles();
    const [email, setEmail] = useState("");
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    useEffect(() => {
        window.location.reload();
    }, []);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const onResetPassword = async (e: any) => {
        e.preventDefault();
        await axios
            .post("/password/email", { email, _token: csrf_token })
            .then(() => {
                setMessage(
                    "あなたのメールアドレスにリセット用のメールを送信しました"
                );
                handleClickOpen();
            })
            .catch(error => {
                console.log(error);
            });
    };
    return (
        <>
            <Helmet>
                <title>パスワードリセットメール送信 | ゆうあるえる</title>
            </Helmet>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <VpnKeyIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        パスワードリセットメール送信
                    </Typography>
                    <form className={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="email"
                                    label="メールアドレス"
                                    name="email"
                                    autoComplete="email"
                                    onChange={e => setEmail(e.target.value)}
                                    value={email}
                                />
                            </Grid>
                        </Grid>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={onResetPassword}
                        >
                            送信
                        </Button>
                    </form>
                </div>
            </Container>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    {message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ResetPassword;
