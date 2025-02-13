import { Text, View, Switch, ScrollView } from "react-native";
import BadgerPrefContext from '../BadgerPrefContext'
import React, { useState, useEffect, useContext } from 'react';

export default function BadgerPreferencesScreen(props) {

    const { tags, prefs, setPrefs } = useContext(BadgerPrefContext);
    const [switches, setSwitches] = useState([]);

    //Used ChatGPT to figure out how to do this
    useEffect (() => {
        startPrefs = {};
        tags.forEach(tag => {
            startPrefs[tag] = true;
        });
        setPrefs(startPrefs);
        setSwitches(tags.map(() => true));
    }, [tags, setPrefs]);

    //Used ChatGPT to figure out how to do this
    const toggleSwitch = (index) => {
        const newSwitches = [...switches];
        newSwitches[index] = !newSwitches[index];
        setSwitches(newSwitches);

        const newPrefs = { ...prefs };
        newPrefs[tags[index]] = newSwitches[index];
        setPrefs(newPrefs);
    }

    return (
        <ScrollView contentContainerStyle={{ alignItems: "center", paddingTop: 128 }}>
            {tags.map((tag, index) => (
                <View>
                    <Text>{tag}</Text>
                    <Switch onValueChange={() => toggleSwitch(index)} value={switches[index]}/>
                </View>
            ))}
        </ScrollView>
    );
}
