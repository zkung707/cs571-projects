import createChatDelegator from "./ChatDelegator";
import { useState } from 'react';
import { getLoggedInUsername, isLoggedIn, logout, ofRandom } from "./Util";

const createChatAgent = () => {
    const CS571_WITAI_ACCESS_TOKEN = "7GDEGRF3DTAJUORLATAB5AW6XFJ3ACPF"; // Put your CLIENT access token here.

    const delegator = createChatDelegator();

    let chatrooms = [];

    const handleInitialize = async () => {
        const resp = await fetch("https://cs571api.cs.wisc.edu/rest/f24/hw11/chatrooms", {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        });
        const data = await resp.json();
        chatrooms = data;

        return "Welcome to BadgerChat! My name is Bucki, how can I help you?";
    }

    const handleReceive = async (prompt) => {
        if (delegator.hasDelegate()) { return delegator.handleDelegation(prompt); }
        const resp = await fetch(`https://api.wit.ai/message?q=${encodeURIComponent(prompt)}`, {
            headers: {
                "Authorization": `Bearer ${CS571_WITAI_ACCESS_TOKEN}`
            }
        })
        const data = await resp.json();
        if (data.intents.length > 0) {
            switch (data.intents[0].name) {
                case "get_help": return handleGetHelp();
                case "get_chatrooms": return handleGetChatrooms();
                case "get_messages": return handleGetMessages(data);
                case "login": return handleLogin();
                case "register": return handleRegister();
                case "create_message": return handleCreateMessage(data);
                case "logout": return handleLogout();
                case "whoami": return handleWhoAmI();
            }
        }
        return "Sorry, I didn't get that. Type 'help' to see what you can do!";
    }

    const handleGetHelp = async () => {
        const responses = ["Try asking 'tell me the latest 3 messages', or ask for more help!", "Try asking 'register for an account', or ask for more help!",
            "Try asking 'what chatrooms are there', or ask for more help!"];

        return ofRandom(responses);
    }

    const handleGetChatrooms = async () => {
        return "There are " + chatrooms.length + " chatrooms: " + chatrooms.join(", ");
    }

    const handleGetMessages = async (data) => {
        const number = data.entities["quantity:quantity"] ? true : false;
        const numberValue = number ? data.entities["quantity:quantity"][0].value : 0;

        const chatroom = data.entities["chatroom:chatroom"] ? true : false;
        const chatroomName = chatroom ? data.entities["chatroom:chatroom"][0].value : "";

        let URL = "https://cs571api.cs.wisc.edu/rest/f24/hw11/messages";
        if (number && chatroom) {
            URL = `https://cs571api.cs.wisc.edu/rest/f24/hw11/messages?chatroom=${chatroomName}&num=${numberValue}`;
        } else if (number && !chatroom) {
            URL = `https://cs571api.cs.wisc.edu/rest/f24/hw11/messages?num=${numberValue}`;
        } else if (!number && chatroom) {
            URL = `https://cs571api.cs.wisc.edu/rest/f24/hw11/messages?chatroom=${chatroomName}`;
        }

        let messages = [];

        const resp = await fetch(URL, {
            method: "GET",
            credentials: "include",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(), 
            },
        });

            const d = await resp.json();
            messages = d.messages;

        return messages.map(m => `In ${m.chatroom}, ${m.poster} created a post titled '${m.title}' saying ${m.content}`);
    }

    const handleLogin = async () => {
        return await delegator.beginDelegation("LOGIN");
    }

    const handleRegister = async () => {
        return await delegator.beginDelegation("REGISTER");
    }

    const handleCreateMessage = async (data) => {
        return await delegator.beginDelegation("CREATE", data);
    }


    const handleLogout = async () => {
        if (await isLoggedIn()) {
            await logout();
            return "You have successfully logged out.";
        } else {
            return "You have to be logged in to logout.";
        }
    }

    const handleWhoAmI = async () => {
        if (await isLoggedIn()) {
            let user = await getLoggedInUsername();
            return `You are currently logged in as ${user}`;
        } else {
            return "You aren't logged in!";
        }
    }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createChatAgent;