import { Text, View, ScrollView } from "react-native";
import React, { useState, useEffect, useContext } from 'react';
import CS571 from '@cs571/mobile-client'
import BadgerNewsItemCard from '../BadgerNewsItemCard'
import BadgerPrefContext from '../BadgerPrefContext'

function BadgerNewsScreen(props) {

    const { articles, prefs } = useContext(BadgerPrefContext);
    const [filteredArticles, setFilteredArticles] = useState([]);

    useEffect(() => {
        const updatedArticles = articles.filter(article => {
            return article.tags.every(tag => prefs[tag] !== false);
        })
        setFilteredArticles(updatedArticles);
    }, [prefs, articles]);

    return <ScrollView>
        {filteredArticles.length == 0 ? (
            <Text>No articles match your preferences!</Text>
        ) : (
            filteredArticles.map((article) => (
                <BadgerNewsItemCard key = {article.id} {...article}/>
            ))
        )}
    </ScrollView>
}

export default BadgerNewsScreen;