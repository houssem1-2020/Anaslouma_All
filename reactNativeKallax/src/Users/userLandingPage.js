import React, { useEffect, useState } from 'react';
import { View,  Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import styles from '../AssetsM/theme'
import { Appbar, Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();


const Screen1Component = () => {
  return(<Text>One</Text>)
}
const Screen2Component = () => {
  return(<Text>Two</Text>)
}

const Screen3Component = () => {
  return(<Text>Two</Text>)
}


const App = () => {

  const navigation = useNavigation();
 
 

  useEffect(() => {
    checkIfStored()
  }, []);

  const checkIfStored = async () => {
    const value = await AsyncStorage.getItem('UserData');
    if (!value) { navigation.navigate('UserLogIn') }
  };

  const retrieveData = async (key) => {
    await AsyncStorage.removeItem('UserData');
    navigation.navigate('UserLogIn')
   // try {
   //   const value = await AsyncStorage.getItem(key);
   //   if (value !== null) {
   //     console.log('Retrieved data:', value);
   //     // Do something with the retrieved data
   //   } else {
   //     console.log('No data found for the key:', key);
   //   }
   // } catch (error) {
   //   console.error('Error retrieving data:', error);
   // }
 };

  const AppBar = () => {
    return(<>
          <Appbar style={{backgroundColor:'white'}}>
            <Appbar.BackAction onPress={() => navigation.navigate('LandingPage')} />
            <Appbar.Content title=" " /> 
            <Appbar.Action 
            icon={({ color, size }) => (
              <View style={styles.container}>
                <TouchableOpacity  style={styles.imageContainer} onPress={() => retrieveData('UserLogIn')}>
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
          {/* <View style={styles.content}> */}
              <Tab.Navigator 
                  tabBarOptions={{
                    activeTintColor: '#b50079', // Change active icon color
                    inactiveTintColor: '#75736e', // Change inactive icon color
                    labelStyle: { fontSize: 14, fontWeight: 'bold' },
                    tabBarStyle: { paddingTop: 50, paddingBottom: 50 } ,// Adjust padding as needed
                    tabBarItemStyle: { marginVertical: 5 }
                  }}>
                
                <Tab.Screen 
                    name="Liste" 
                    component={Screen1Component} 
                    options={{
                      headerShown: false,
                      tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'grid' : 'grid-outline'}  size={25} color={focused ? '#b50079' : '#75736e'} /> ,
                    }}
                  />
                  <Tab.Screen 
                    name="Favoris" 
                    component={Screen2Component} 
                    options={{
                      headerShown: false,
                      tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'heart': 'heart-outline'} size={25} color={focused ? '#b50079' : '#75736e'} /> ,
                    }}
                  />
                  <Tab.Screen 
                    name="Paramétres" 
                    component={Screen3Component} 
                    options={{
                      headerShown: false,
                      tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'settings': 'settings-outline'} size={25} color={focused ? '#b50079' : '#75736e'} /> ,
                    }}
                  />
                  <Tab.Screen 
                    name="Pro" 
                    component={Screen3Component} 
                    options={{
                      headerShown: false,
                      tabBarIcon: ({ color, size, focused }) => <TouchableOpacity onPress={() => navigation.navigate('ProfLandingPage')}  style={{ alignItems: 'center', justifyContent: 'center' }}>
                      
                      <Image 
                        source={{uri:`https://assets.ansl.tn/Images/kallax/tech.png`}} 
                        style={{ width: 25, height: 25  }} 
                      />
                      <Text style={{ position: 'absolute', top: -5, right: -13, backgroundColor: '#bf0842', color: '#ffffff', height: 20,  width: 20, textAlign: 'center', lineHeight: 20,  borderRadius: 50,   }}>{18}</Text> 
                     </TouchableOpacity>,
                    }}
                  />
              </Tab.Navigator>
            </View>
        {/* </View> */}
    </SafeAreaView>
    </SafeAreaProvider>
  );
};

 

export default App;
