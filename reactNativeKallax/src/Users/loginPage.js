import React, { useEffect, useState } from 'react';
import { View, Text,  Button, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions , BackHandler, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Assuming you're using React Navigation for navigation
import { connect, useDispatch } from 'react-redux';
import { setUserIsLogged } from '../AssetsM/redux/actions';
import { Appbar } from 'react-native-paper';
import styles from '../AssetsM/theme';
import { TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import GConf from '../AssetsM/GConf';

function UserLogIn() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [loginD, setLoginD] = useState({ Log: '', Pwd: '' });
    const [loaderState, setLS] = useState(false);
    const [showPassword, setShowPassword] = useState(true);

    useEffect(() => {
      checkIfStored()
        const backAction = () => {
            // Handle Android hardware back button press
            navigation.goBack();
            return true;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
    }, []);

 
    const checkIfStored = async () => {
      const value = await AsyncStorage.getItem('UserData');
      if (value) { navigation.navigate('LandingPage') }
    };

    const storeData = async (key, value) => {
      await AsyncStorage.setItem(key, value);
       
      // try {
      //   await AsyncStorage.setItem(key, value);
      //   console.log('Data stored successfully');
      // } catch (error) {
      //   console.error('Error storing data:', error);
      // }
    };

    const logInSystem = () => {
        if (!loginD.Log || loginD.Log == '') { Alert.alert("Entrer Un Identifiant"); } 
        else if (!loginD.Pwd) { Alert.alert("Entrer Un Mot de passe ! ");} else {
            setLS(true);
            console.log('Work')
            axios.post(`${GConf.ApiLink}/User/LogIn`, {
              tag: 'kallax',
              LoginData: loginD,
            })
            .then(function (response) {
              if (response.data.length !== 0) {
                //Alert.alert('Connecté !');
                storeData('UserData',JSON.stringify(response.data))
                storeData('SearchIn', JSON.stringify({depart: response.data.BirthGouv, region: response.data.BirthDeleg}))
                if (response.data.Related_PID) {
                  storeData('ProffAccount', JSON.stringify({ PID: response.data.Related_PID, UID: response.data.UID }));
                  navigation.navigate('LandingPage')
                } else {
                  navigation.navigate('LandingPage')
                }
                setLS(false);
              } else {
                Alert.alert('Cet User n\'existe pas !');
                setLS(false);
              }
            })
            .catch(function (error) {
              console.error('Error:', error);
              setLS(false);
            });
        }
    };


    const AppBar = () => {
      return(<>
            <Appbar style={{backgroundColor:'transparent'}}>
              <Appbar.Action 
              icon={({ color, size }) => (
                <View style={[styles.container, {backgroundColor : 'transparent'}]}>
                  <TouchableOpacity onPress={() => navigation.navigate('LandingPage')}>
                    <Image
                      source={{uri:`https://assets.ansl.tn/Images/favicon.ico`}} // Replace with the path to your image
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
    const BottomCard = () => {
      return (
        <View style={{ backgroundColor: '#6f787d', borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
            <View style={{ padding: 20 }}>
              <View style={{ flex: 1 }}>
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ color: 'white' }}>
                    <Ionicons name="call-outline" size={12} color="white" /> +21697913914, +33 6 56 70 89 08
                  </Text>
                  <Text style={{ color: 'white' }}>
                  <Ionicons name="map-outline" size={13} color="white" /> 5, rue oberlin Schiltigheim 67300
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 0, justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'start', flex: 1 }}>
                <IconButton icon={() => <Ionicons name="logo-facebook" size={20} color="white" />} onPress={() => navigate('#')} />
                    <IconButton icon={() => <Ionicons name="logo-youtube" size={20} color="white" />} onPress={() => navigate('#')} />
                    <IconButton icon={() => <Ionicons name="logo-instagram" size={20} color="white" />} onPress={() => navigate('#')} />
                    <IconButton icon={() => <Ionicons name="logo-whatsapp" size={20} color="white" />} onPress={() => navigate('#')} />
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                <IconButton icon={() => <Ionicons name="arrow-forward" size={20} color="white" />} onPress={() => navigate('/about')} />
                </View>
              </View>
            </View>
        </View>
      );
    };
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor:'white' }}>
            <AppBar />    
              {loaderState && <View style={{ position : 'absolute', backgroundColor: 'rgba(0, 0, 0, 0.5)', width: Dimensions.get('window').width, height: Dimensions.get('window').height, zIndex:99, justifyContent: 'center', alignItems: 'center',}}><ActivityIndicator size="large" color="white" /></View>}
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <View style={{   width:'100%' }}>
                    <Text style={{ fontSize: 24, marginBottom: 20, justifyContent: 'start',   }}><TextInput.Icon icon="text" /> Connexion :</Text>
                </View>
 
                <TextInput
                  style={{ backgroundColor:'white',   marginBottom: 5, width: '100%' }}
                  mode="outlined"
                  label="Identifiant"
                  onChangeText={(text) => setLoginD({...loginD, Log: text })}
                  right={<TextInput.Icon icon="text" />}
                />
 
                <TextInput
                  style={{  backgroundColor:'white',  marginBottom: 30, width: '100%' }}
                  mode="outlined"
                  label="Mot de Passe"
                  secureTextEntry={showPassword}
                  onChangeText={(text) => setLoginD({...loginD, Pwd: text })}
                  right={<TextInput.Icon icon="eye" onPress={() => setShowPassword(!showPassword)} />}
                />
                


                <TouchableOpacity
                    style={{ backgroundColor: '#097599', padding: 15,  marginBottom: 20, width: '100%', alignItems: 'center', borderRadius: 8 }}
 
                    onPress={()=> logInSystem()}
                > 
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="log-in" size={20} color="white" />
                            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', marginLeft: 10 }}>Connexion </Text>
                          </View>
                          
                    {/* <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}> <TextInput.Icon icon="eye" /> Connexion</Text> */}
                </TouchableOpacity>


                <TouchableOpacity style={{ backgroundColor: '#c9c9c9', padding: 15, width: '100%', alignItems: 'center', borderRadius: 8 }} onPress={() => navigation.navigate('SignUpPage')}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="people" size={20} color="white" />
                    <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', marginLeft: 5 }}>S'inscrire</Text>
                  </View>
                </TouchableOpacity>

            </View>
            <BottomCard />
            
        </ScrollView>
    );
}

export default UserLogIn;
