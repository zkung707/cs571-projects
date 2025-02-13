import { isLoggedIn } from "../Util";

const createRegisterSubAgent = (end) => {

    let stage;

    let username, pin, repeatpin;

    const regex = /^\d{7}$/;

    const handleInitialize = async (promptData) => {
        if (await isLoggedIn()) {
            return "You must log out before registering.";
        } else {
            stage = "FOLLOWUP_USERNAME"
            return "Got it! What username would you like to use?";
        }
    }

    const handleReceive = async (prompt) => {
        switch(stage) {
            case "FOLLOWUP_USERNAME": return await handleFollowupUsername(prompt);
            case "FOLLOWUP_PIN": return await handleFollowupPin(prompt);
            case "FOLLOWUP_REPEATPIN": return await handleFollowupRepeatPin(prompt);
        }
    }

    const handleFollowupUsername = async (prompt) => {
        username = prompt;
        stage = "FOLLOWUP_PIN";
        return {
            msg: "Thank you, what pin would you like to use? This must be 7 digits.",
            nextIsSensitive: true
        }
    }

    const handleFollowupPin = async (prompt) => {
        pin = prompt;
        if (!regex.test(prompt)) {
            return end({
                msg: "PIN was not 7 digits. Cancelling registration.",
                emote: "error"
            });
        } else {
            stage = "FOLLOWUP_REPEATPIN";
            return {
                msg: "Finally, please confirm your pin.",
                nextIsSensitive: true
            };
        }
    }

    const handleFollowupRepeatPin = async (prompt) => {
        repeatpin = prompt;
        if (pin != repeatpin) {
            return end ({
                msg: `PINs do not match. Cancelling registration.`,
                emote: "error"
            });
        }

        const resp = await fetch ("https://cs571api.cs.wisc.edu/rest/f24/hw11/register", {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify ({
                username: username,
                pin: pin
            })
        })
        if (resp.status == 200) {
            return end ({
                msg: `Success! Welcome to BadgerChat, ${username}.`,
                emote: "SUCCESS"
            });
        } else if (resp.status == 409) {
            return end ({
                msg: "This user already exists!",
                emote: "error"
            });
        } else {
            return end ({
                msg: "Registration failed, please try again!",
                emote: "error"
            });
        }
    }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createRegisterSubAgent;