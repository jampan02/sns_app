import axios from "axios";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert";
import { csrf_token } from "../../..";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import FormControl from "@material-ui/core/FormControl";
import queryString from "query-string";
import { Container, CssBaseline } from "@material-ui/core";
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

const ChangePassword = () => {
    const classes = useStyles();

    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const search = useLocation().search;
    const query = queryString.parse(search);
    const query_email = query["email"] as string;
    const params: { csrf: string } = useParams(); // URLのパスパラメータを取得。例えば、 /uses/2 なら、2の部分を取得
    const token = params.csrf;
    useEffect(() => {
        console.log(params);
        console.log(location);
        console.log(query_email);
        setEmail(query_email);
    }, []);

    const createNewPassword = async (e: any) => {
        e.preventDefault();
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
            _token: csrf_token,
            token,
            email,
            password,
            password_confirmation: passwordConfirm
        };
        await axios
            .post("/password/reset", data)
            .then(() => {
                history.push("/login", {
                    message: "パスワードが変更されました"
                });
            })
            .catch(error => {
                console.log(error);
            });
    };
    return (
        <>
            <Helmet>
                <title>パスワードを忘れた | ゆうあるえる</title>
            </Helmet>

            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <VpnKeyIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        新しいパスワード設定
                    </Typography>
                    <form className={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl disabled>
                                    <TextField
                                        id="email"
                                        label="メールアドレス"
                                        name="email"
                                        autoComplete="email"
                                        variant="outlined"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        disabled
                                    />
                                </FormControl>
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
                            variant="contained"
                            color="primary"
                            onClick={createNewPassword}
                        >
                            送信
                        </Button>
                    </form>
                </div>
            </Container>
        </>
    );
};

export default ChangePassword;
