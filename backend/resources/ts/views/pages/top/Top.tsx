import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Helmet } from "react-helmet";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import Posts from "../../components/Posts";
import Snackbar from "@material-ui/core/Snackbar";

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const Top: React.FC = () => {
    const [message, setMessage] = useState("");
    const location: any = useLocation();

    useEffect(() => {
        if (location.state !== undefined) {
            console.log(location.state);
            setMessage(location.state.message);
            handleClick();
        }
    }, []);

    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    return (
        <>
            <Helmet>
                <title>トップページ | ゆうあるえる</title>
            </Helmet>

            <Posts path="/api/get/post/scroll" defaultCurrency="all" />
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    {message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Top;
