import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import styles from '../AssetsM/theme'
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const App = () => {

  const navigation = useNavigation();

  const AppBar = () => {
    return(<>
          <Appbar style={{backgroundColor:'white'}}>
            <Appbar.BackAction onPress={() => navigation.navigate('LandingPage')} />
            <Appbar.Content title=" " /> 
            <Appbar.Action 
            icon={({ color, size }) => (
              <View style={styles.container}>
                <TouchableOpacity  style={styles.imageContainer} onPress={() => Alert.alert('User')}>
                  <Image
                    source={{uri:`https://assets.ansl.tn/Images/kallax/user.gif`}} // Replace with the path to your image
                    style={{ width: 25, height: 25 }}
                  />
                </TouchableOpacity >
              </View>
        )}
        onPress={() => {}}
      />
          </Appbar>
    </>)
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1}} >
        <View style={styles.container}>
          <AppBar />
          <View style={styles.content}>
            <Text style={styles.textContent}> Prof Landing Page!</Text>
          </View>
        </View>
    </SafeAreaView>
    </SafeAreaProvider>
  );
};

 

export default App;
