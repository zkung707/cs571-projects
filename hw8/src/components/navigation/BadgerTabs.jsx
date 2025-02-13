import { NavigationContainer } from "@react-navigation/native";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BadgerNewsScreen from '../screens/BadgerNewsScreen'
import BadgerPreferencesScreen from '../screens/BadgerPreferencesScreen'
import BadgerNewsStack from "../screens/BadgerNewsStack";

function BadgerTabs(props) {
    const Tabs = createBottomTabNavigator();
    return <>
        <NavigationContainer independent = {true}>
            <Tabs.Navigator screenOptions={{ headerShown: false }}>
                <Tabs.Screen name="News" component = {BadgerNewsStack}/>
                <Tabs.Screen name="Preferences" component = {BadgerPreferencesScreen}/>
            </Tabs.Navigator>
        </NavigationContainer>
    </>
}

export default BadgerTabs;