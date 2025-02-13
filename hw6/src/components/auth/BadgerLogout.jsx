import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';

export default function BadgerLogout() {

    const navigate = useNavigate();
    useEffect(() => {
        fetch('https://cs571api.cs.wisc.edu/rest/f24/hw6/logout', {
            method: 'POST',
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            },
            credentials: "include"
        }).then(res => res.json()).then(json => {
            sessionStorage.setItem("loginStatus", "false");
            sessionStorage.removeItem("posterName");
            alert(json.msg);
            navigate("/");
            window.location.reload();
        })
    }, []);

    return <>
        <h1>Logout</h1>
        <p>You have been successfully logged out.</p>
    </>
}
