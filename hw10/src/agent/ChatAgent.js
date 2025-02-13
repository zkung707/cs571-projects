
const createChatAgent = () => {

    const CS571_WITAI_ACCESS_TOKEN = "QTBXPZISODN66DLL4FAMMMBHRP32QGWA"; // Put your CLIENT access token here.

    let availableItems = [];
    let cart;

    const handleInitialize = async () => {
        const res = await fetch('https://cs571api.cs.wisc.edu/rest/f24/hw10/items', {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        });
        if (!res.ok) {
            console.log(`Error status: ${res.status}`)
        }
        const data = await res.json();
        availableItems = data;

        cart = [];
        for (let i = 0; i < availableItems.length; i++) {
            cart.push({name: availableItems[i].name, quantity: 0});
        }
        
        return ("Welcome to BadgerMart Voice! :) Type your question, or ask for help if you're lost!");
    }

    const handleReceive = async (prompt) => {
        const resp = await fetch("https://api.wit.ai/message?q=" + encodeURIComponent(prompt), {
            headers: {
                "Authorization": "Bearer "+ CS571_WITAI_ACCESS_TOKEN
            }
        })
        const data = await resp.json();

        if (data.intents.length > 0) {
            switch (data.intents[0].name) {
                case "get_help": return getHelp();
                case "get_items": return getItems();
                case "get_price": return getPrice(data);
                case "add_item": return addItem(data);
                case "remove_item": return removeItem(data);
                case "view_cart": return view_cart();
                case "checkout": return checkOut();
                default: return fallBack();
            }
        }
        return fallBack();
    }


    const getHelp = async () => {
        const tips = ["Try adding or removing items from your basket!", "Try asking for a list of items!", "Try to add an item to your cart!"]; 
        const randomIndex = Math.floor(Math.random() * tips.length);
        return tips[randomIndex];
    }

    const fallBack = async () => {
        return "Sorry, I didn't get that. Type 'help' to see what you can do!";
    }

    const getItems = async () => {
        let itemList = availableItems.slice(0, -1).map(item => item.name).join(", ");
        let lastItem = availableItems[availableItems.length -1].name;
        return `We have ${itemList}, and ${lastItem} for sale!`;
    }

    const getPrice = async(promptData) => {
        const item = promptData.entities["item_type:item_type"] ? true : false;
        if (item == false) {
            return "That item is not in stock.";
        }

        const itemType = item ? promptData.entities["item_type:item_type"][0].value : "invalid";

        const findItem = availableItems.find(item => {
            return item.name === itemType;
        });
        return `${findItem.name} costs $${findItem.price.toFixed(2)} each.`

    }

    const addItem = async(promptData) => {
        if (!promptData.entities) {
            return "The item is not in stock.";
        }

        const item = promptData.entities["item_type:item_type"] ? true : false;
        const itemType = item ? promptData.entities["item_type:item_type"][0].value : "invalid";
        if (itemType == "invalid") {
            return "The item is not in stock.";
        }

        let quantity = 1;
        try {
        quantity = item ? promptData.entities["wit$number:quantity"][0].value : 1;
        } catch (e) {};

        const cartIndex = cart.findIndex(item => itemType === item.name);
        const cartItem = cart[cartIndex];
        cartItem.quantity += quantity;

        return `Added ${quantity} ${itemType} to your cart!`;
    }

    const removeItem = async(promptData) => {
        if (!promptData.entities) {
            return "The item is not in stock.";
        }

        const item = promptData.entities["item_type:item_type"] ? true : false;
        const itemType = item ? promptData.entities["item_type:item_type"][0].value : "invalid";
        if (itemType == "invalid") {
            return "The item is not in stock.";
        }

        const cartIndex = cart.findIndex(item => itemType === item.name);
        if (cartIndex === -1 ) {
            return `That is not in your cart.`;
        }

        let quantity = 1;
        try {
            quantity = item ? promptData.entities["wit$number:quantity"][0].value : 1;
            if (quantity < 0) {
                return "That quantity is invalid. Please input a positive number.";
            }
        } catch (e) {};

        const cartItem = cart[cartIndex];
        if (cartItem.quantity <= quantity) {
            let pastQuantity = parseInt(cartItem.quantity, 10);
            cartItem.quantity = 0;
            return `${pastQuantity} ${cartItem.name} has been removed from your cart.`;
        } else {
            cartItem.quantity = String(cartItem.quantity - quantity);
            return `${quantity} ${cartItem.name} has been removed from your cart.`;
        }
    }

    const view_cart = async() => {
        const itemsInCart = cart.filter(item => item.quantity > 0);

        if (itemsInCart.length === 0) {
            return "Your cart is empty.";
        }

        let viewCart = [];
        let totalPrice = 0;

        itemsInCart.forEach(item => {
            const itemName = availableItems.find(i => i.name == item.name);
            if (itemName) {

                const itemTotal = item.quantity * itemName.price;
                totalPrice += itemTotal;
                let quantity = parseInt(item.quantity, 10);
                viewCart.push(`${quantity} ${item.name}`);
            }
        });

        const items = viewCart.join(", ");
        const formatPrice = totalPrice.toFixed(2);
        return `You have ${items} in your cart, totaling $${formatPrice}.`;
    }

    const checkOut = async() => {
        const itemsInCart = cart.filter(item => item.quantity > 0);

        if (itemsInCart.length === 0) {
            return "Your cart is empty.";
        }

        let order = {};
        for (let i = 0; i < cart.length; i++) {
            const item = cart[i];
            order[item.name] = item.quantity;
        }

        const res = await fetch('https://cs571api.cs.wisc.edu/rest/f24/hw10/checkout', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": CS571.getBadgerId()
            },
            body: JSON.stringify(order)
        });

        if (!res.ok) {
            console.log(res.status);
        }

        const data = await res.json();
        cart = [];

        return `Success! Your confirmation ID is ${data.confirmationId}`;
    }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createChatAgent;