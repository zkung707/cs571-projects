import React from 'react';
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";

export default function BadgerRegister() {

    const usernameRef = useRef();
    const pinNumberRef = useRef();
    const pinConfirmationRef = useRef();
    const regex = /^\d{7}$/;

    function register(e) {
        if (!usernameRef.current.value || !pinNumberRef.current.value) {
            alert("You must provide both a username and pin!");
            return;
        } else if (!regex.test(pinNumberRef.current.value) || !regex.test(pinConfirmationRef.current.value)) {
            alert("Your pin must be a 7-digit number!");
            return;
        } else if (pinNumberRef.current.value != pinConfirmationRef.current.value) {
            alert("Your pins do not match!");
            return;
        } else {
            e?.preventDefault();

            fetch("https://cs571api.cs.wisc.edu/rest/f24/hw6/register" , {
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
                    alert("Successfully registered!")
                } else {
                    return res.json().then(data => {
                        alert(data.msg);
                    });
                }
            })
        }
    }

    return <>
        <h1>Register</h1>
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
            <Form.Label htmlFor="pinConfirmation">Password</Form.Label>
            <Form.Control
                id = "pinConfirmation"
                ref={pinConfirmationRef}
                type="password"
            />
        </Form>
        <br/>
        <Button variant="primary" onClick = {register}>Submit</Button>
    </>
}
