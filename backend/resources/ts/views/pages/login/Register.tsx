import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
//import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
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
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    large: {
        width: theme.spacing(15),
        height: theme.spacing(15)
    }
}));

export default function Register() {
    //let csrf_token = document.head.querySelector('meta[name="csrf-token"]').content;
    const history = useHistory();
    const classes = useStyles();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    // const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    //const [image, setImage] = useState("");
    const [introduction, setIntroduction] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const onSignUp = (e: any) => {
        e.preventDefault();
        /*    if (password !== confirmPassword) {
            return;
        }*/
        const image =
            "https://sns-app-storage.s3.ap-northeast-1.amazonaws.com/default/121647.jpg";
        const data = {
            name,
            password,
            email,

            password_confirmation: passwordConfirm
        };
        axios
            .post("/register", data)
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
                    <form className={classes.form} noValidate>
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
                                <Link to="/login">
                                    アカウントを持っていますか？
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
}
