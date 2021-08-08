import React from "react";
import queryString from "query-string";
import { Helmet } from "react-helmet";
import StickUser from "../components/StickUser";

const UserResult = () => {
    const parsed = queryString.parse(location.search);
    const query = parsed.q as string;

    return (
        <>
            <Helmet>
                <title>
                    "{query}"に関するユーザーの検索結果 | ゆうあるえる
                </title>
            </Helmet>
            <StickUser
                path="/api/get/user/search"
                isSearchResult={true}
                q={query}
            />
        </>
    );
};

export default UserResult;
