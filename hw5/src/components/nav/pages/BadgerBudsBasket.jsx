import React, { useEffect, useContext, useState } from 'react';
import {Button, Card, Row, Col} from "react-bootstrap";
import BadgerBudsDataContext from "../../../contexts/BadgerBudsDataContext"
import SavedBadgerBud from '../../savedBadgerBud';

export default function BadgerBudsBasket(props) {
    const budsData = useContext(BadgerBudsDataContext);
    const [savedCats, setSavedCats] = useState([]);

    const loadCats= () => {
        const savedCatIds = JSON.parse(sessionStorage.getItem('savedCatIds'));
        const adoptedCatIds = JSON.parse(sessionStorage.getItem('adoptedCatIds'));

        const savedCatsData = budsData
            .filter(cat => savedCatIds.includes(cat.id))
            .filter(cat => ! adoptedCatIds.includes(cat.id));
        setSavedCats(savedCatsData);
        };

        useEffect(() => {
            loadCats();
        }, [budsData]);

        const unsaveCat = (id) => {
            const savedCatIds = JSON.parse(sessionStorage.getItem('savedCatIds'));
            const updatedCatIds = savedCatIds.filter(cat => cat !== id);
            sessionStorage.setItem('savedCatIds', JSON.stringify(updatedCatIds));
            setSavedCats(displayedCats => displayedCats.filter(cat => cat.id !== id))
        };

    return (
        <div>
        <h1>Badger Buds Basket</h1>
        <p>These cute cats could be all yours!</p>
        {savedCats.length == 0 ? (
            <p>You have no buds in your basket!</p>
        ) : (
        <Row>
            {savedCats.map((buddy) => (
                <Col key = {buddy.id} xs={12} sm={6} md={4} lg={3}>
                    <SavedBadgerBud buddy = {buddy} loadCats = {loadCats}/>
                </Col>
            ))}
        </Row>
        )}
    </div>
    );
}