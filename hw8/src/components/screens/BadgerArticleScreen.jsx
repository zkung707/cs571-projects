import React, { useState, useRef, useEffect } from 'react';
import CS571 from '@cs571/mobile-client'
import { Animated, Button, Dimensions, View, Text, Image, Linking, Pressable } from 'react-native';

export default function BadgerArticleScreen(props) {

    const [article, setArticle] = useState([]);
    const [loading, setLoading] = useState(true);

    let url = `https://cs571api.cs.wisc.edu/rest/f24/hw8/article?id=${props.route.params.articleId}`;
    let image = `https://raw.githubusercontent.com/CS571-F24/hw8-api-static-content/main/${props.route.params.img}`;

    const fadeRef = useRef(new Animated.Value(0));

    useEffect(() => {
        fetch(url, {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
        .then(res => res.json())
        .then(article => {
            setArticle(article)
            setLoading(false);
            Animated.timing(fadeRef.current, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }).start();
        })
    }, []);

    const openURL = () => {
        Linking.openURL(article.url);
    }

    return (
        <View>
            {loading ? (
                <Text style={{fontSize:30}}>Loading...</Text>
            ) : (
                <Animated.View style={{opacity: fadeRef.current}}>
                    <Image source={{uri:image}} style={{width: '100%', height: 200}}/>
                    <Text style={{fontSize:30}}>{article.title}</Text>
                    <Text style={{fontSize:25}}>{article.author} on {article.posted}</Text>
                    <Pressable onPress={() => openURL()}>
                        <Text style={{ color: 'blue'}}>Click here for the full article.</Text>
                    </Pressable>
                    {article.body.map((paragraph, index) => (
                        <Text key={index}>{paragraph}</Text>
                    ))}
                </Animated.View>
            )}
        </View>
    )
}