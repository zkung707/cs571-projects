import { useState } from "react";
import { Button, Card, Table } from "react-bootstrap";

export default function FeaturedItem(props) {
    let showFacts = "Show Nutrition Facts";
    let hideFacts = "Hide Nutrition Facts";
    const [facts, setFacts] = useState(showFacts);
    const [displayFacts, setDisplayFacts] = useState(false);

    function flipFacts() {
        if (facts == hideFacts) {
            setFacts(showFacts);
            setDisplayFacts(false);
        } else {
            setFacts(hideFacts);
            setDisplayFacts(true);
        }
        }

        const NutritionFacts = () => (
            <div>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                    <th>Calories</th>
                    <th>Fat</th>
                    <th>Carbohydrates</th>
                    <th>Protein</th>
                    </tr>
                    </thead>
                <tbody>
                    <tr>
                    <td>{props.nutrition.calories != null ? props.nutrition.calories : '0'}</td>
                    <td>{props.nutrition.fat != null ? props.nutrition.calories : '0g'}</td>
                    <td>{props.nutrition.carbohydrates != null ? props.nutrition.carbohydrates : '0g'}</td>
                    <td>{props.nutrition.protein != null ? props.nutrition.calories : '0g'}</td>
                    </tr>
                </tbody>
                </Table>
            </div>
        )

    return <Card>
        <img src = {props.img} style = {{width: '100%', height: '100%'}} alt = {props.name}/>
        <h3>{props.name}</h3>
        <h6>${props.price} per unit</h6>
        <p>{props.description}</p>
        {displayFacts ? <NutritionFacts /> : null}
        <Button variant = "success" onClick = {flipFacts}>{facts}</Button>
    </Card>

}