import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import Alert from "@material-ui/lab/Alert";
import { Helmet } from "react-helmet";
function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
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
const Login = () => {
    const history = useHistory();
    const classes = useStyles();
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [email, setEmail] = useState("");
    //ユーザー情報

    const onSignUp = (e: any) => {
        if (password === "") {
            setErrorMessage("パスワードは必須です");
            return;
        }
        if (email === "") {
            setErrorMessage("メールアドレスは必須です");
            return;
        }
        if (password.length < 8) {
            setErrorMessage("パスワードは8文字以上です");
            return;
        }
        e.preventDefault();

        const data = {
            password,
            email
        };
        axios
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
                <title>ログインページ | ゆうあるえる</title>
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
                            onClick={onSignUp}
                        >
                            登録
                        </Button>
                        <Grid container justify="flex-end">
                            <Grid item>
                                <Link to="/register">
                                    アカウントを持っていませんか？
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <Box mt={5}>
                    <Copyright />
                </Box>
            </Container>
        </>
    );
};

export default Login;
