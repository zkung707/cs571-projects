const Student = (props) => {
    return <div>
        <h2>{props.name.first} {props.name.last}</h2>
        <h4>{props.major}</h4>
        <p>{props.name.first} is taking {props.numCredits} credits.</p>
        <p>{props.name.first} is {props.fromWisconsin ? "" : "NOT"} from Wisconsin.</p>
        <p>Interests:</p>
        <ul>
            {props.interests.map((interest, index) => (
                <li key={index}>{interest}</li>
            ))}
        </ul>
    </div>
}

export default Student;