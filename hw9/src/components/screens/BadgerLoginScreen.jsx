import { Alert, Button, StyleSheet, Text, View, TextInput, useNavigation } from "react-native";
import React, { useState } from 'react';

function BadgerLoginScreen(props) {
    const [username, setUsername] = useState("");
    const [pin, setPin] = useState("");

    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>BadgerChat Login</Text>
        <Text style={{fontSize: 20 }}>Username</Text>
        <TextInput style = {{ fontSize: 20, borderWidth: 2, boderColor: 'black', width: 200 }} placeholder = "Username" value = {username} onChangeText = {setUsername} autoCapitalize="none"/>
        <Text>PIN</Text>
        <TextInput style = {{ fontSize: 20, borderWidth: 2, boderColor: 'black', width: 200 }} placeholder="PIN" value={pin} onChangeText={setPin} keyboardType="number-pad" maxLength={7} secureTextEntry={true}/>
        <Button color="crimson" title="Login" onPress={() => {
            props.handleLogin(username, pin);
        }} />
        <Button color="grey" title="Signup" onPress={() => props.setIsRegistering(true)} />
        <Button color="grey" title="Continue as Guest" onPress={() => props.handleGuest()} />
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

export default BadgerLoginScreen;