import React, { useContext, useState } from 'react';
import {Button, Card, Carousel, CarouselItem} from "react-bootstrap";

function BadgerBudSummary({ buddy, removeCat }) {

    const imgUrl = "https://raw.githubusercontent.com/CS571-F24/hw5-api-static-content/main/cats/" + buddy.imgIds[0];

    let showMoreInfo = "Show more";
    let showLessInfo = "Show less";
    const[showMore, setMore] = useState(false);
    const[buttonText, setButton] = useState(showMoreInfo);

    function flipMore() {
        if (buttonText == showMoreInfo) {
            setButton(showLessInfo);
            setMore(true);
        } else {
            setButton(showMoreInfo);
            setMore(false);
        }
    }

    const about = () => (
        <div>
            <p>{buddy.gender}</p>
            <p>{buddy.breed}</p>
            <p>{buddy.age}</p>
            <p>{buddy.description != null ? buddy.description : ""}</p>
        </div>
    )

    const carousel = () => (
        <Carousel>
            {buddy.imgIds.map((id, index) =>
            <CarouselItem key={index}>
                <img src = {"https://raw.githubusercontent.com/CS571-F24/hw5-api-static-content/main/cats/" + id} alt = "photo of cat" style = {{width: '100%', height: '100%'}}/>
            </CarouselItem>
            )}
        </Carousel>
    );

    function saveCat() {
        const savedCatIds = JSON.parse(sessionStorage.getItem('savedCatIds'));
        savedCatIds.push(buddy.id);
        sessionStorage.setItem('savedCatIds', JSON.stringify(savedCatIds));
        alert(buddy.name + " has been added to your basket!");
        removeCat(buddy.id);
    }

    return (
            <Card key = {buddy.id} style = {{margin: "0.25rem", maxWidth: "30rem"}}>
            {showMore ? carousel() : (<img src = {imgUrl} alt = "photo of cat" style = {{width: '100%', height: '100%'}}/>)}
            <h2 style = {{fontSize : "1.25rem"}}>{buddy.name}</h2>
            {showMore ? about() : null}
            <Button onClick = {flipMore}>{buttonText}</Button>
            <Button onClick = {saveCat}>Save</Button>
            </Card>
    );
}

export default BadgerBudSummary;