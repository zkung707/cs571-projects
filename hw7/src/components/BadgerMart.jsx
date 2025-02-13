import { Text, View, Button, Alert } from "react-native";
import BadgerSaleItem from "./BadgerSaleItem";
import React, { useState, useEffect } from 'react';

import CS571 from '@cs571/mobile-client'

export default function BadgerMart(props) {

    const [items, setItems] = useState([]);
    const [numApples, setNumApples] = useState(0);
    const [numBagels, setNumBagels] = useState(0);
    const [numCoconuts, setNumCoconuts] = useState(0);
    const [numDonuts, setNumDonuts] = useState(0);
    const [numEggs, setNumEggs] = useState(0);

    useEffect(() => {
    fetch('https://cs571api.cs.wisc.edu/rest/f24/hw7/items', {
        headers: {
            "X-CS571-ID": CS571.getBadgerId()
        }
    })
        .then(res => res.json())
        .then(items => {
            setItems(items)
        })
    }, []);

    const [index, setIndex] = useState(0);

    const nextItem = () => {
        setIndex((prevIndex) => (prevIndex + 1));
    }

    const prevItem = () => {
        setIndex((prevIndex) => (prevIndex - 1));
    }

    const getCountType = () => {
        if (items[index]?.name === "Apple") {
            return numApples;
        } else if (items[index]?.name === "Bagel") {
            return numBagels;
        } else if (items[index]?.name === "Coconut") {
            return numCoconuts;
        } else if (items[index]?.name === "Donut") {
            return numDonuts;
        } else if (items[index]?.name === "Eggs") {
            return numEggs;
        }
        return 0;
    }

    const getSetCountType = () => {
        if (items[index]?.name === "Apple") {
            return setNumApples;
        } else if (items[index]?.name === "Bagel") {
            return setNumBagels;
        } else if (items[index]?.name === "Coconut") {
            return setNumCoconuts;
        } else if (items[index]?.name === "Donut") {
            return setNumDonuts;
        } else if (items[index]?.name === "Eggs") {
            return setNumEggs;
        }
        return  () => {};
    };

    const getTotal = () => numApples + numBagels + numCoconuts + numDonuts + numEggs;

    const getPrice = () => (numApples * 0.75 + numBagels * 0.5 + numCoconuts * 2.5 + numDonuts * 1.5 + numEggs).toFixed(2);

    const submitOrder = () => {
        let message = "Your order contains " + getTotal() + " items and would have cost $" + getPrice() + "!";
        Alert.alert("Order Confirmed!", message);
    }

    return <View>
        <Text style={{fontSize: 28}}>Welcome to Badger Mart!</Text>
        <Button title="Previous" onPress={prevItem} disabled = {index === 0}/><Button title="Next" onPress={nextItem} disabled = {index === items.length - 1}/>
            <BadgerSaleItem 
                key = {index} 
                {...items[index]} 
                countType = {getCountType()} 
                setCountType = {getSetCountType()}/>
        <Text>You have {getTotal() || 0} item(s) costing ${getPrice() || 0} in your cart!</Text>
        <Button title= "Place Order" disabled = {getTotal() === 0} onPress = {submitOrder}></Button>
    </View>
}