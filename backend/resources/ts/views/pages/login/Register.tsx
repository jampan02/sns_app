import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import axios from "axios";
import { useHistory, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Snackbar } from "@material-ui/core";
function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright © "}

            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
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
        width: "100%",
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
function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
export default function Register() {
    const history = useHistory();
    const location: any = useLocation();
    const classes = useStyles();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [email, setEmail] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [message, setMessage] = useState("");

    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        if (location.state !== undefined) {
            console.log(location.state);
            setMessage(location.state.message);
            handleClick();
        }
    }, []);
    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    const onSignUp = async (e: any) => {
        e.preventDefault();
        if (name === "") {
            setErrorMessage("ユーザーネームは必須です");
            return;
        }
        if (name === "テストユーザー") {
            setErrorMessage("その名前は使用できません");
            return;
        }
        if (email === "") {
            setErrorMessage("メールアドレスは必須です");
            return;
        }
        if (password === "") {
            setErrorMessage("パスワードは必須です");
            return;
        }
        if (passwordConfirm === "") {
            setErrorMessage("確認用パスワードは必須です");
            return;
        }
        if (password.length < 8) {
            setErrorMessage("パスワードは8文字以上です");
            return;
        }
        if (password !== passwordConfirm) {
            setErrorMessage("パスワードと確認用パスワードが一致しません");
            return;
        }

        const data = {
            name,
            password,
            email,
            password_confirmation: passwordConfirm
        };
        await axios
            .post("/register", data)
            .then(res => {
                console.log("reg=", res.data);
                history.push("/");
            })
            .catch(error => {
                console.log(error.response);
                const validationError = error.response.data.errors.email[0];
                setErrorMessage(validationError);
            });
    };
    const onTestLogin = async (e: any) => {
        e.preventDefault();
        const data = {
            email: "jampan021@gmail.com",
            password: "testuser"
        };

        await axios
            .post("/login", data)
            .then(res => {
                history.push("/");
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <>
            <Helmet>
                <title>登録ページ | ゆうあるえる</title>
            </Helmet>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        新規登録
                    </Typography>
                    <form
                        className={classes.form}
                        noValidate
                        onSubmit={onSignUp}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="fname"
                                    name="name"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="ユーザーネーム"
                                    autoFocus
                                    onChange={e => setName(e.target.value)}
                                    value={name}
                                />
                            </Grid>

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
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="password"
                                    label="パスワード"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={e => setPassword(e.target.value)}
                                    value={password}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="password_confirmation"
                                    label="確認用"
                                    type="password"
                                    id="password_confirmation"
                                    autoComplete="current-password_confirmation"
                                    onChange={e =>
                                        setPasswordConfirm(e.target.value)
                                    }
                                    value={passwordConfirm}
                                />
                            </Grid>
                        </Grid>
                        {errorMessage && (
                            <Alert
                                severity="error"
                                className={classes.errorMessage}
                            >
                                {errorMessage}
                            </Alert>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            登録
                        </Button>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            className={classes.submit}
                            onClick={onTestLogin}
                        >
                            テストログイン
                        </Button>

                        <Grid container justify="flex-end">
                            <Grid item>
                                <Link to="/login">アカウントがあります</Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <Box mt={5}>
                    <Copyright />
                </Box>
            </Container>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    {message}
                </Alert>
            </Snackbar>
        </>
    );
}
