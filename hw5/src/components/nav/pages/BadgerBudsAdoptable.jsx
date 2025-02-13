import BadgerBudsDataContext from "../../../contexts/BadgerBudsDataContext"
import BadgerBudSummary from "../../BadgerBudSummary"
import React, { useContext, useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';

export default function BadgerBudsAdoptable(props) {
    const budsData = useContext(BadgerBudsDataContext);
    const [buds, setBuds] = useState(budsData);
    

    const loadAvailableCats = () => {
        const savedCatIds = JSON.parse(sessionStorage.getItem('savedCatIds'));
        const adoptedCatIds = JSON.parse(sessionStorage.getItem('adoptedCatIds'));

        const availableCats = budsData
            .filter(cat => ! savedCatIds.includes(cat.id))
            .filter(cat => ! adoptedCatIds.includes(cat.id));
        setBuds(availableCats);
    }

    useEffect(() => {
        if (!sessionStorage.getItem('savedCatIds')) {
            sessionStorage.setItem('savedCatIds', JSON.stringify([]));
        }
        if (!sessionStorage.getItem('adoptedCatIds')) {
            sessionStorage.setItem('adoptedCatIds', JSON.stringify([]));
        }
        loadAvailableCats();
    }, []);

    const removeCat = (id) => {
        setBuds((displayedBuds) => displayedBuds.filter(cat => cat.id !== id));
    };


    return ( 
        <div>
        <h1>Available Badger Buds</h1>
        <p>The following cats are looking for a loving home! Could you help?</p>
        {buds.length == 0 ? (
            <p>No buds are available for adoption!</p>
        ) : (
        <Row>
            {buds.map((buddy) =>
            <Col key = {buddy.id} xs={12} sm={6} md={4} lg={3}>
            <BadgerBudSummary buddy={buddy} removeCat={removeCat}/>
            </Col>
            )}
        </Row>
        )}

    </div>
    );
}