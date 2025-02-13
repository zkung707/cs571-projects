import { isLoggedIn } from "../Util";

const createPostSubAgent = (end) => {

    let stage;
    let chatroom, title, content, confirmation;

    const handleInitialize = async (promptData) => {
        console.log(promptData);
        if (!await isLoggedIn()) {
            return end("You must be logged in to create a post.");
        } else {
            const chatroomE = promptData.entities["chatroom:chatroom"] ? true : false;
            if (!chatroomE) {
                return end("Please specify a chat room.");
            }
            chatroom = chatroomE ? promptData.entities["chatroom:chatroom"][0].value : " ";
            stage = "FOLLOWUP_TITLE";
            return "Great! What should be the title of your post?";
        }
        
    }

    const handleReceive = async (prompt) => {
        switch(stage) {
            case "FOLLOWUP_TITLE": return await handleFollowupTitle(prompt);
            case "FOLLOWUP_CONTENT": return await handleFollowupContent(prompt);
            case "FOLLOWUP_CONFIRMATION": return await handleFollowupConfirmation(prompt);
        }
    }

    const handleFollowupTitle = async (prompt) => {
        title = prompt;
        stage = "FOLLOWUP_CONTENT";
        return "Alright, and what should be the content of your post?";
    }

    const handleFollowupContent = async (prompt) => {
        content = prompt;
        stage = "FOLLOWUP_CONFIRMATION";
        return `Excellent! To confirm, you want to create this post titled '${title}' in ${chatroom}?`;
    }

    const handleFollowupConfirmation = async (prompt) => {
        confirmation = prompt;
        let temp = confirmation.toLowerCase();
        //wasn't sure about hardcoding? But making an entity for this seemed strange
        if (temp == "yes" || temp == "y") {

            const resp = await fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw11/messages?chatroom=${chatroom}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "X-CS571-ID": CS571.getBadgerId(),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title,
                    content: content
                })
            })

            if (resp.status == 200) {
                return end({
                    msg: `All set! Your post has been made in ${chatroom}.`,
                    emote: "SUCCESS"
                });
            } else {
                return end({
                    msg: "Something went wrong!",
                    emote: "error"
                });
            }
        } else {
            return end("Post cancelled.");
        }
    }
    return {
        handleInitialize,
        handleReceive
    }
}

export default createPostSubAgent;