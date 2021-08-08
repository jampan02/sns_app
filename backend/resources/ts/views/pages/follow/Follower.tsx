import React from "react";
import { useParams } from "react-router";
import { Helmet } from "react-helmet";
import StickUser from "../../components/StickUser";
const Follower = () => {
    const params: { id: string; user: string } = useParams();
    const targetUserName = params.user;
    const targetUserId = params.id;

    return (
        <>
            <Helmet>
                <title>
                    {targetUserName}さんをフォローしてるユーザー | ゆうあるえる
                </title>
            </Helmet>
            <StickUser
                path="/api/get/follower"
                isSearchResult={false}
                targetId={targetUserId}
            />
        </>
    );
};

export default Follower;
