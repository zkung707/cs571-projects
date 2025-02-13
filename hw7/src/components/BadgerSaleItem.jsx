import { Text, View, Image, Button } from "react-native";

export default function BadgerSaleItem({ name, price, upperLimit, imgSrc, countType, setCountType }) {

        const decrementAmount = () => {
            setCountType((count) => count - 1);
        }

        const incrementAmount = () => {
            setCountType((count) => count + 1);
        }

    return <View>
        {
            imgSrc ? <Image style={{width:250, height:250}} source={{uri: imgSrc}}/> : <></>
        }
        <Text style = {{fontSize: 48, textAlign: "center"}}>{name}</Text>
        {price != undefined && (
            <Text style = {{fontSize: 24, textAlign: "center"}}>${price.toFixed(2)} each</Text>
        )}
        <Text style = {{textAlign: "center"}}>You can order up to {upperLimit} units!</Text>
        <Button title="-" onPress={decrementAmount} disabled = {countType === 0}/><Text style = {{textAlign: "center"}}>{countType}</Text><Button title="+" onPress={incrementAmount} disabled = {countType == upperLimit}/> 
    </View>
}
