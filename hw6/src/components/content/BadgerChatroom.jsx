import React, { useEffect, useState, useRef } from "react"
import { Row, Pagination, Form, Button } from "react-bootstrap";
import BadgerMessage from "./BadgerMessage";

export default function BadgerChatroom(props) {

    const postTitleRef = useRef();
    const postContentRef = useRef();

    function post(e) {
    if (sessionStorage.getItem("loginStatus") == "false") {
            alert("You must be logged in to post!");
            return;
    } else if (!postTitleRef.current.value || !postContentRef.current.value) {
            alert("You must provide both a title and content!");
            return;
        } else {
            e?.preventDefault();

            fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw6/messages?chatroom=${props.name}` , {
                method: "POST",
                credentials: "include",
                headers: {
                    "X-CS571-ID": CS571.getBadgerId(),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify ({
                    title: postTitleRef.current.value,
                    content: postContentRef.current.value
                })
            })
            .then(res => {
                if (res.status === 200) {
                    alert("Successfully posted!");
                    loadMessages();
                } else {
                    return res.json().then(data => {
                        alert(data.msg);
                    });
                }
            })
        }
    }


    const [messages, setMessages] = useState([]);
    const itemsPerPage = 25;
    const [page, setPage] = useState(1);

    const loadMessages = () => {
        fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw6/messages?chatroom=${props.name}&page=${page}`, {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        }).then(res => res.json()).then(json => {
            setMessages(json.messages)
        })
    };

    const changePage = (page) => {
        setPage(page);
        loadMessages();
    }

    function deletePost(e, postId) {
            e?.preventDefault();
            fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw6/messages?id=${postId}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "X-CS571-ID": CS571.getBadgerId(),
                    "Content-Type": "application/json"
                }
            })
            .then(res => {
                if (res.status === 200) {
                    alert("Successfully deleted the post!");
                    loadMessages();
                } else {
                    alert("ERROR DELETING");
                }
            })
    }


    // Why can't we just say []?
    // The BadgerChatroom doesn't unload/reload when switching
    // chatrooms, only its props change! Try it yourself.
    useEffect(loadMessages, [props]);

    return <>
        <h1>{props.name} Chatroom</h1>
        {
            <>
            <Form>
                <Form.Label htmlFor="postTitle">Post Title</Form.Label>
                <Form.Control
                    id="postTitle"
                    ref={postTitleRef} />
                <Form.Label htmlFor="postContent">Post Content</Form.Label>
                <Form.Control
                    id="postContent"
                    ref={postContentRef} />
            </Form>
            <br/>
            <Button variant = "primary" onClick = {post}>Create Post</Button>
            </>
        }
        <hr/>
        {
            messages.length > 0 ?
                <>
                <Row sm={2} md={3} lg={4}>
                    {
                        messages.map((message, index) => (
                            <BadgerMessage key={index} 
                            {...message} 
                            handleDelete={deletePost}/>
                        ))
                    }
                    </Row>
                <Pagination>
                    <Pagination.Item onClick = { () => changePage(1)} active={page === 1}>1</Pagination.Item>
                    <Pagination.Item onClick = { () => changePage(2)} active={page === 2}>2</Pagination.Item>
                    <Pagination.Item onClick = { () => changePage(3)}active={page === 3}>3</Pagination.Item>
                    <Pagination.Item onClick = { () => changePage(4)}active={page === 4}>4</Pagination.Item>
                </Pagination>
                </>
                :
                <>
                    <p>There are no messages on this page yet!</p>
                    <Pagination>
                    <Pagination.Item onClick = { () => changePage(1)} active={page === 1}>1</Pagination.Item>
                    <Pagination.Item onClick = { () => changePage(2)} active={page === 2}>2</Pagination.Item>
                    <Pagination.Item onClick = { () => changePage(3)}active={page === 3}>3</Pagination.Item>
                    <Pagination.Item onClick = { () => changePage(4)}active={page === 4}>4</Pagination.Item>
                </Pagination>
                </>
        }
    </>
}
