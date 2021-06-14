import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useHistory } from "react-router";
import { RootState } from "../../../store/index";
type DATA = {
    title: string | null;
};

const Create = () => {
    const history = useHistory();
    const [body, setBody] = useState("");
    const [url, setUrl] = useState("");
    //ユーザー情報
    const user = useSelector((state: RootState) => state.user.user);
    const onCreatePost = async () => {
        //e.preventDefault();
        const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
        let site_name: string | null = null;
        let title: string | null = null;
        let image: string | null = null;
        //スクレイピング
        await fetch(CORS_PROXY + url, { mode: "cors" })
            .then(res => res.text())
            .then(text => {
                const el = new DOMParser().parseFromString(text, "text/html");
                const headEls = el.head.children;
                Array.from(headEls).map(v => {
                    const prop = v.getAttribute("property");
                    if (!prop) return;
                    console.log(prop, v.getAttribute("content"));
                    switch (prop) {
                        case "og:title":
                            title = v.getAttribute("content");
                            break;
                        case "og:site_name":
                            site_name = v.getAttribute("content");
                            break;
                        case "og:image":
                            image = v.getAttribute("content");
                            break;
                        default:
                            return;
                    }
                });
            });
        //ユーザーID取得
        if (user) {
            const userId = user.id;
            const data = {
                user_id: userId,
                site_name,
                title,
                image,
                url,
                body
            };
            //投稿
            axios
                .post("/api/add", data)
                .then(() => {
                    history.push("/");
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };
    return (
        <div>
            <input
                type="text"
                onChange={e => setUrl(e.target.value)}
                placeholder="url"
            />
            aaaaaa
            <input
                type="text"
                onChange={e => setBody(e.target.value)}
                placeholder="コメント"
            />
            <button onClick={onCreatePost}>送信</button>
        </div>
    );
};

export default Create;
