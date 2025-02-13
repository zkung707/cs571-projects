import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import { useRef, useContext, useEffect } from "react";

import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerLogin() {

    const usernameRef = useRef();
    const pinNumberRef = useRef();
    const regex = /^\d{7}$/;
    const navigate = useNavigate();

    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);

    function login(e) {
        if (!regex.test(pinNumberRef.current.value)) {
            alert("Your pin is a 7-digit number!");
            return;
        } else if (!usernameRef.current.value || !pinNumberRef.current.value) {
            alert("You must provide both a username and pin!")
        } else {
            e?.preventDefault();
            
            fetch("https://cs571api.cs.wisc.edu/rest/f24/hw6/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "X-CS571-ID": CS571.getBadgerId(),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify ({
                    username: usernameRef.current.value,
                    pin: pinNumberRef.current.value
                })
            })
            .then(res => {
                if (res.status === 200) {
                    setLoginStatus(true);
                    sessionStorage.setItem('loginStatus', "true");
                    sessionStorage.setItem('posterName', usernameRef.current.value);
                    alert("Successfully logged in!")
                    navigate('/');
                } else {
                    return res.json().then(data => {
                        alert(data.msg);
                    });
                }
            })
        }
    }

    return <>
        <h1>Login</h1>
        <Form>
            <Form.Label htmlFor="username">Username</Form.Label>
            <Form.Control
                id = "username"
                ref={usernameRef}
                />
            <Form.Label htmlFor="pinNumber">Password</Form.Label>
            <Form.Control
                id = "pinNumber"
                ref={pinNumberRef}
                type="password"
            />
        </Form>
        <br/>
        <Button variant="primary" onClick = {login}>Login</Button>

    </>
}
