import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const User = () => {
    const [name, setName] = useState("");
    const user = useSelector((state: RootState) => state.user.user);
    useEffect(() => {
        if (user) {
            setName(user.name);
        }
    }, []);
    return (
        <div>
            a<p>{name}</p>
        </div>
    );
};

export default User;
