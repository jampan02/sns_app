import React from "react";
import { useParams } from "react-router";
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
