import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import styles from '../theme';
import { Ionicons } from '@expo/vector-icons';

const TypingEffect = ({ textArray, typingSpeed = 50, loop = false }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (displayText === textArray[currentTextIndex]) {
        setTimeout(() => {
          setDisplayText('');
          setCurrentTextIndex((prevIndex) =>
            loop ? (prevIndex + 1) % textArray.length : prevIndex
          );
        }, 1000); // Delay before clearing text
      } else {
        const newText = textArray[currentTextIndex].substring(
          0,
          displayText.length + 1
        );
        setDisplayText(newText);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, currentTextIndex]);

  return <Text style={styles.typedText}> <Ionicons name="caret-forward-outline" size={15}  /> {displayText}</Text>;
};

export default TypingEffect;