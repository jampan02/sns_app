import Typography from "@material-ui/core/Typography";
import React from "react";
import { Helmet } from "react-helmet";
const NotFound = () => {
    return (
        <>
            <Helmet>
                <title>404 Not Found | ゆうあるえる</title>
            </Helmet>
            <Typography variant="h3">404 Not Found</Typography>
            <Typography>サイトがみつかりませんでした。</Typography>
        </>
    );
};

export default NotFound;
