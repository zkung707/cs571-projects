import { Alert, Button, StyleSheet, Text, View, TextInput } from "react-native";
import React, { useState } from 'react';

function BadgerRegisterScreen(props) {
    const [username, setUsername] = useState("");
    const [pin, setPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const correct = true;
    let errorMessage = "";

    const register = () => {
        if (!pin) {
            errorMessage = "Please enter a pin.";
            correct = false;
        } else if (pin != confirmPin) {
            errorMessage = "Pins do not match.";
            correct = false;
        } else {
            props.handleSignup(username, pin);
        }
    }

    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>Join BadgerChat!</Text>
        <Text>Username</Text>
        <TextInput style = {{ fontSize: 20, borderWidth: 2, width: 200 }} placeholder = "Username" value = {username} onChangeText = {setUsername} autoCapitalize="none"/>
        <Text>PIN</Text>
        <TextInput style = {{ fontSize: 20, borderWidth: 2, width: 200 }} placeholder = "PIN" value = {pin} onChangeText = {setPin} keyboardType="number-pad" maxLength={7} secureTextEntry={true}/>
        <Text>Confirm Pin</Text>
        <TextInput style = {{ fontSize: 20, borderWidth: 2, width: 200 }} placeholder = "PIN" value = {confirmPin} onChangeText = {setConfirmPin} keyboardType="number-pad" maxLength={7} secureTextEntry={true}/>
        { correct ? <Text style = {{ color: "crimson" }}>{errorMessage}</Text> : null }
        <Button color="crimson" title="Signup" onPress={register}/>
        <Button color="grey" title="Nevermind!" onPress={() => props.setIsRegistering(false)} />
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default BadgerRegisterScreen;