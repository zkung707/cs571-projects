import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { Button, Image, View, Text } from "react-native";
import { Card } from 'react-native-paper';

export default function BadgerNewsItemCard(props) {
    let image = `https://raw.githubusercontent.com/CS571-F24/hw8-api-static-content/main/${props.img}`;

    const navigation = useNavigation();
    
    const read = () => {
        navigation.navigate("Article", {
            articleId: props.fullArticleId,
            img: props.img
        })
    }

    return <Card style={{marginTop:8, padding:8}} onPress={read}>
        <Image source={{uri: image}} style={{width: '100%', height: 150}}/>
        <Text style={{fontSize: 20}}>{props.title}</Text>
    </Card>

}
