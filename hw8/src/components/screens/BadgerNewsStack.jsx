import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BadgerNewsScreen from '../screens/BadgerNewsScreen'
import BadgerArticleScreen from '../screens/BadgerArticleScreen'
import BadgerPreferencesScreen from "./BadgerPreferencesScreen";


export default function BadgerNewsStack(props) {
    let stack = createNativeStackNavigator();
    return (
        <stack.Navigator>
            <stack.Screen name="Articles" component={BadgerNewsScreen}/>
            <stack.Screen name = "Article" component={BadgerArticleScreen}/>
            <stack.Screen name = "Preferences" component={BadgerPreferencesScreen}/>
        </stack.Navigator>
    )
}