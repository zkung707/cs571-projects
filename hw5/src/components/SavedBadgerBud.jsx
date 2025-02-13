import React, { useContext, useState } from 'react';
import {Button, Card} from "react-bootstrap";
import BadgerBudsDataContext from '../contexts/BadgerBudsDataContext';

function SavedBadgerBud({ buddy, loadCats }) {

    const imgUrl = "https://raw.githubusercontent.com/CS571-F24/hw5-api-static-content/main/cats/" + buddy.imgIds[0];

    const unselectCat = () => {
        const savedCatIds = JSON.parse(sessionStorage.getItem('savedCatIds'));
        const updatedCatIds = savedCatIds.filter(id => id != buddy.id);
        sessionStorage.setItem('savedCatIds', JSON.stringify(updatedCatIds));
        loadCats();
    };

    function adoptCat() {
        const adoptedCatIds = JSON.parse(sessionStorage.getItem('adoptedCatIds'));
        adoptedCatIds.push(buddy.id);
        sessionStorage.setItem('adoptedCatIds', JSON.stringify(adoptedCatIds));
        alert("Thank you for adopting " + buddy.name + "!");
        loadCats();
    }

    return (
            <Card key = {buddy.id} style = {{margin: "0.25rem", maxWidth: "30rem"}}>
            <img src = {imgUrl} alt = "photo of cat" style = {{maxHeight: "200px", objectFit: "cover"}}/>
            <h2 style = {{fontSize : "1.25rem"}}>{buddy.name}</h2>
            <Button onClick={adoptCat}>Adopt</Button>
            <Button onClick={unselectCat}>Unselect</Button>
            </Card>
    );
}

export default SavedBadgerBud;