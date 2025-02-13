import { Text, Pressable } from "react-native";
import BadgerCard from "./BadgerCard"

function BadgerChatMessage(props) {

    let deleteButton = false;
    if (props.guest == false) {
        if (props.currentUser.user.username == props.poster) {
            deleteButton = true;
        }
    }
        

    const dt = new Date(props.created);

    return <BadgerCard style={{ marginTop: 16, padding: 8, marginLeft: 8, marginRight: 8 }}>
        <Text style={{fontSize: 28, fontWeight: 600}}>{props.title}</Text>
        <Text style={{fontSize: 12}}>by {props.poster} | Posted on {dt.toLocaleDateString()} at {dt.toLocaleTimeString()}</Text>
        <Text></Text>
        <Text>{props.content}</Text>
        {deleteButton && (
            <Pressable style={{ backgroundColor: 'crimson' }} onPress={() => {
                props.deletePost(props.id)}}>
                <Text style={{ color: 'white' }}>Delete Post</Text>
            </Pressable>
        )}
    </BadgerCard>
}

export default BadgerChatMessage;