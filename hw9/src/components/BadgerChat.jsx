import { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

import CS571 from '@cs571/mobile-client'
import * as SecureStore from 'expo-secure-store';
import BadgerChatroomScreen from './screens/BadgerChatroomScreen';
import BadgerRegisterScreen from './screens/BadgerRegisterScreen';
import BadgerLoginScreen from './screens/BadgerLoginScreen';
import BadgerLandingScreen from './screens/BadgerLandingScreen';
import BadgerLogoutScreen from './screens/BadgerLogoutScreen';
import BadgerConversionScreen from './screens/BadgerConversionScreen';


const ChatDrawer = createDrawerNavigator();

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);
  const [guest, setGuest] = useState(false);

  useEffect(() => {
    if (isLoggedIn || guest) {
      fetch('https://cs571api.cs.wisc.edu/rest/f24/hw9/chatrooms', {
        method: "GET",
        headers: {
          "X-CS571-ID": CS571.getBadgerId(),
        },
      }).then(res => res.json())
        .then(data => {
          setChatrooms(data);
      });
    }
  }, [isLoggedIn, guest]);


  async function handleLogin(username, pin) {
    const res = await fetch("https://cs571api.cs.wisc.edu/rest/f24/hw9/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CS571-ID": CS571.getBadgerId(),
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify({
        username: username,
        pin: pin
      })
    });

    if (res.status == 200) {
      const data = await res.json();
      await SecureStore.setItemAsync("token", data.token);
      setIsLoggedIn(true);
    } else {
      const data = await res.json();
      Alert.alert("Alert", data.msg);
    }
  }

  async function handleSignup(username, pin) {
      const res = await fetch("https://cs571api.cs.wisc.edu/rest/f24/hw9/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CS571-ID": CS571.getBadgerId(),
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify({
        username: username,
        pin: pin
      })
    });

    if (res.status === 200) {
      const data = await res.json();
      await SecureStore.setItemAsync("token", data.token);
      setIsLoggedIn(true);
      setIsRegistering(false);
    } else {
      const data = await res.json();
      Alert.alert("Alert", data.msg);
    }
  }

  const logout = () => {
    setIsLoggedIn(false);
    setIsGuest(false);
  }

  const handleGuest = () => {
    setGuest(true);
    setIsLoggedIn(false);
  }


  if (isRegistering) {
    return (<BadgerRegisterScreen handleSignup={handleSignup} setIsRegistering={setIsRegistering}/>
    );
  }
  if (isLoggedIn || guest) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {
            chatrooms.map(chatroom => {
              return <ChatDrawer.Screen key={chatroom} name={chatroom}>
                {(props) => <BadgerChatroomScreen name={chatroom} guest={guest}/>}
              </ChatDrawer.Screen>
            })
          }
          {guest ? (
            <ChatDrawer.Screen name ="Signup">
            {() => <BadgerConversionScreen setIsRegistering={setIsRegistering} isRegistering={isRegistering}/>}
            </ChatDrawer.Screen>
          ) : (
            <ChatDrawer.Screen name ="Logout">
            {() => <BadgerLogoutScreen onLogout={logout}/>}
            </ChatDrawer.Screen>
          )}
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } else {
      return <BadgerLoginScreen handleLogin={handleLogin} setIsRegistering={setIsRegistering} handleGuest={handleGuest}/>
  }
}