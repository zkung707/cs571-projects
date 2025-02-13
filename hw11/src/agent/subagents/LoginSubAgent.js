import { isLoggedIn, ofRandom } from "../Util"

const createLoginSubAgent = (end) => {

    let stage;

    let username, pin;

    const handleInitialize = async (promptData) => {
        if (await isLoggedIn()) {
            return end("You are already logged in, try logging out first.");
        } else {
        stage = "FOLLOWUP_USERNAME";
        return "Got it! What is your username?";
        }
    }

    const handleReceive = async (prompt) => {
        switch(stage) {
            case "FOLLOWUP_USERNAME": return await handleFollowupUsername(prompt);
            case "FOLLOWUP_PIN": return await handleFollowupPin(prompt);
        }
    }

    const handleFollowupUsername = async (prompt) => {
        username = prompt;
        stage = "FOLLOWUP_PIN";
        return {
            msg: "Got it! What is your pin?",
            nextIsSensitive: true
        };
    };

    const handleFollowupPin = async (prompt) => {
        pin = prompt;
        const resp = await fetch ("https://cs571api.cs.wisc.edu/rest/f24/hw11/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                pin: pin
            })
        }) 
        if (resp.status == 200) {
            return end ({
                msg: `Logged in! Welcome ${username}.`,
                emote: "SUCCESS"
            });
        } else {
            return end ({
                msg: `Sorry, that username and pin is incorrect.`,
                emote: "error"
            });
        }
    };


    return {
        handleInitialize,
        handleReceive
    }
}

export default createLoginSubAgent;