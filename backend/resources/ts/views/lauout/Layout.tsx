import axios from "axios";
import React, { useEffect, ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { POST } from "../../utils/type";
import { useHistory } from "react-router";
type PROPS = {
    children: ReactNode;
};

const Layout: React.FC<PROPS> = ({ children }) => {
    const history = useHistory();
    const [keyword, setKeyword] = useState("");
    const [isPost, setIsPost] = useState(true);
    const onSearch = () => {
        if (keyword === "") {
            return;
        }
        if (isPost) {
            history.push({
                pathname: "/search/post",
                search: `?q=${keyword}`
            });
        } else {
            history.push({
                pathname: "/search/user",
                search: `?q=${keyword}`
            });
        }

        /*axios.get("/api/get/search",{params:{keyword}}).then(res=>{
			setPosts(res.data)

		}).catch(error=>{
			console.log(error)
		})*/
    };
    return (
        <div>
            <ul>
                <li>
                    <Link to="/">トップページ</Link>
                </li>
                <li>
                    <Link to="/create">新規投稿</Link>
                </li>
                <li>
                    <Link to="/user">ユーザー情報</Link>
                </li>
                <li>
                    <input
                        type="text"
                        placeholder="キーワード"
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                        onKeyPress={e => {
                            if (e.key == "Enter") {
                                e.preventDefault();
                                onSearch();
                            }
                        }}
                    />
                    <button onClick={() => setIsPost(!isPost)}>
                        {isPost ? <>投稿検索</> : <>ユーザー検索</>}
                    </button>
                </li>
            </ul>
            {children}
        </div>
    );
};

export default Layout;
