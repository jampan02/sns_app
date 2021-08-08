import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router";
import { RootState } from "../../../store";
import axios from "axios";
import { FOLLOW, USER } from "../../../utils/type";
import { makeStyles } from "@material-ui/core/styles";
import { login_user } from "../../../store/counter/user/action";
import { Helmet } from "react-helmet";
import StickUser from "../../components/StickUser";

const Followee = () => {
    const params: { id: string; user: string } = useParams();
    const targetUserName = params.user;
    const targetUserId = params.id;

    return (
        <>
            <Helmet>
                <title>
                    {targetUserName}さんのフォロー中のユーザー | ゆうあるえる
                </title>
            </Helmet>
            <StickUser
                path="/api/get/followee"
                isSearchResult={false}
                targetId={targetUserId}
            />
        </>
    );
};

export default Followee;
