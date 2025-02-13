import { StyleSheet, Text, View, Modal, Pressable, Alert, FlatList, TextInput } from "react-native";
import { useEffect, useState } from 'react';
import BadgerChatMessage from "../helper/BadgerChatMessage";
import CS571 from '@cs571/mobile-client'
import * as SecureStore from 'expo-secure-store';

function BadgerChatroomScreen(props) {

    const [messages, setMessages] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [currentUserData, setCurrentUserData] = useState("");

    async function getToken() {
        return await SecureStore.getItemAsync('token');
    }

    const fetchMessages = () => {
        fetch (`https://cs571api.cs.wisc.edu/rest/f24/hw9/messages?chatroom=${props.name}`, {
            method: "GET",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(), 
            }
            }).then(res => res.json())
            .then(data => {
                setMessages(data.messages);
                setRefreshing(false);
            }).catch(err => {
                setRefreshing(false);
                console.error("Error fetching messages: ", err);
            })
    }

    const currentUser = async () => {
        const token = await getToken();
        const res =  await fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw9/whoami`, {
            method: "GET",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Authorization": `Bearer ${token}`
            },
        });
         if (res.ok) {
            const data = await res.json();
            setCurrentUserData(data);
            return data;
        }
    }

    useEffect(() => {
        
        const fetchCurrentUser = () => {
            const user = currentUser();
            setCurrentUserData(user);
        };
        fetchCurrentUser();
        fetchMessages();
    }, []);

    const createPost = () => {
        getToken().then(token => {
            fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw9/messages?chatroom=${props.name}`, {
            method: 'POST',
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                title: title,
                content: body
            })
        }).then(res => {
            if (res.ok) {
                setTitle("");
                setBody("");
                setModalVisible(false);
                fetchMessages();
                Alert.alert("Successfully posted!", res.msg);
            } else {
                return res.json().then(data => {
                    console.log(data.msg);
                })
            }
        })
    });
}

    const deletePost = (postId) => {
        getToken().then(token => { 
        fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw9/messages?id=${postId}`, {
            method: "DELETE",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Authorization": `Bearer ${token}`               
            }
        }).then(res=> {
            if (res.status == 200) {
                fetchMessages();
                Alert.alert("Alert", "Post successfully deleted.");
            } else {
                console.log(res.msg);
            }
        })
    });
    }

    return <View style={{ flex: 1 }}>
        {currentUserData ? (
            <FlatList 
            data={messages}
            onRefresh={fetchMessages}
            refreshing={refreshing}
            scrollIndicatorInsets = {{right: 1}}
            keyExtractor={(item) => item.id.toString()}
            renderItem = {({ item }) => (
            <BadgerChatMessage { ... item } currentUser={currentUserData} deletePost={deletePost} guest={props.guest}/>
            )}
            />     
        ) : (
            <Text>Loading...</Text>
        )}
        <Modal
        transparent = {true}
        visible = {modalVisible}>
            <View style={styles.modalContainer}>
                <View style={styles.modal}>
                    <Text style={{ fontSize: 20 }}>Create A Post</Text>

                    <Text>Title</Text>
                    <TextInput style = {{ borderWidth: 2, width: 200 }} value = {title} onChangeText = {setTitle}/>

                    <Text>Body</Text>
                    <TextInput style = {{borderWidth: 2, width: 200, height: 150 }} value = {body} onChangeText = {setBody}/>
                    
                    <Pressable style={styles.modalPost} onPress={createPost} >
                        <Text style={styles.modalButtonText}>Create Post</Text>
                    </Pressable>

                   
                    <Pressable style={styles.modalCancel} onPress={() => setModalVisible(false)}>
                        <Text style={styles.modalButtonText}>Cancel</Text>
                    </Pressable>
                    
                </View>
            </View>
        </Modal>

        {props.guest ? (
         null
        ) : <Pressable style = { styles.postButton } onPress = {() => setModalVisible(true)}>
        <Text style = {{ color:'white', fontSize: 20 }}>Add Post</Text>
        </Pressable> }

    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    postButton: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        paddingVertical: 16,
        backgroundColor: 'crimson',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        flex: 0.4, 
        width: '75%',
        justifyContent: 'center',
        alignItems: 'center', 
        backgroundColor: 'white',
        margin: 10,
    },
    modalPost: {
        width: 100,
        height: 20,
        backgroundColor: 'crimson',
    },
    modalCancel: {
        width: 100,
        height: 20,
        backgroundColor: 'gray',
    },
    modalButtonText: {
        color: 'white',
        textAlign: 'center'
    }
});

export default BadgerChatroomScreen;