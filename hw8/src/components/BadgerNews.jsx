import { NavigationContainer } from '@react-navigation/native';
import { useState, useEffect } from 'react';

import BadgerTabs from './navigation/BadgerTabs';
import BadgerPrefContext from './BadgerPrefContext';
import CS571 from '@cs571/mobile-client';

export default function BadgerNews(props) {

  // Just a suggestion for Step 4! Maybe provide this to child components via context...
  const [prefs, setPrefs] = useState({});
  const [articles, setArticles] = useState([]);
  const [tags, setTags] = useState([]);

  const getTags = (articles) => {
      const newTags = articles.flatMap((article) => article.tags || []);
      setTags(newTags);
  }

  useEffect(() => {
      fetch('https://cs571api.cs.wisc.edu/rest/f24/hw8/articles', {
          headers: {
              "X-CS571-ID": CS571.getBadgerId()
          }
      }) .then (res => res.json())
      .then(articles => {
          setArticles(articles);
          getTags(articles);
      })
  }, []);

  return (
    <>
    <BadgerPrefContext.Provider value={{ prefs, setPrefs, articles, setArticles, tags, setTags }}>
      <NavigationContainer>
        <BadgerTabs />
      </NavigationContainer>
      </BadgerPrefContext.Provider>
    </>
  );
}