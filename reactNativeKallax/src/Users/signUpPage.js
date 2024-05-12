import React, { useState } from 'react';
import { View, Text,   Button, Image, ScrollView  } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
// import { FacebookLoginButton, GoogleLoginButton } from 'react-social-login-buttons';
import { Icon, Loader } from 'react-native-elements';
// import { AppBar, IconButton, InputAdornment, TextInput, Toolbar, Typography } from '@mui/material';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { useSelector } from 'react-redux';
import { Appbar, TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import styles from '../AssetsM/theme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from 'react-native-paper';


function SignUpPage() {
    const [articleD, setArticleD] = useState({ PictureId: '00', BirthDay: new Date().toISOString().split('T')[0] });
    const [saveBtnState, setSaveBtnState] = useState(false);
    const [loaderState, setLS] = useState(false);
    const [delegList, setDelegList] = useState([]);
    const sexListe = [
        { id: 1, text:  'Male' , value: 'Male' },
        { id: 2, text: 'Female', value: 'Female' },
    ];
    const navigation = useNavigation();
    const userIsLogged = useSelector(state => state.isLogged);

    const GetDelegList = (value) => {
        setArticleD({ ...articleD, BirthGouv: value });
        // You need to implement the logic to get the delegation list based on the selected region
    }

    const SignUpFunc = () => {
        // Your sign-up logic here
    }

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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <GestureHandlerRootView>
            <AppBar /> 
            </GestureHandlerRootView>
            
            
            <View style={{ flex: 1, justifyContent: 'center', padding: 25  }}> 
            {/* Facebook Login Button */}
            {/* <FacebookLoginButton onPress={() => {}} /> */}
            <View style={{width:'100%' }}>
             
                <TextInput
                    label="Nom & Prénon"
                    value={articleD.Name}
                     
                    onChangeText={(text) => setArticleD({ ...articleD, Name: text })}
                    InputProps={{
                        endAdornment: (
                            // <InputAdornment position="end">
                              <TextInput.Icon icon="text" />
                            // </InputAdornment>
                        ),
                    }}
                />

                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    placeholder="+33"
                    value={articleD.PhoneNum}
                    onChangeText={(text) => setArticleD({ ...articleD, PhoneNum: text })}
                />

                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    placeholder="04-05-2024"
                    value={articleD.BirthDay}
                    onChangeText={(text) => setArticleD({ ...articleD, BirthDay: text })}
                />

                {/* Sex Picker  */}
                <Picker
                    selectedValue={articleD.Sex}
                    style={{ height: 50, width: '100%' }}
                    onValueChange={(itemValue, itemIndex) =>
                        setArticleD({ ...articleD, Sex: itemValue })
                    }>
                    {sexListe.map((item, index) => (
                        <Picker.Item key={index} label={item.text} value={item.value} />
                    ))}
                </Picker>

                {/* Regions Picker  */}
                <Picker
                    selectedValue={articleD.BirthGouv}
                    style={{ height: 50, width: '100%' }}
                    onValueChange={(itemValue, itemIndex) => GetDelegList(itemValue)}>
                    {/* You need to implement the logic to populate the regions */} 
                </Picker>

                {/* Departments Picker  */}
                <Picker
                    selectedValue={articleD.BirthDeleg}
                    style={{ height: 50, width: '100%' }}
                    onValueChange={(itemValue, itemIndex) =>
                        setArticleD({ ...articleD, BirthDeleg: itemValue })
                    }>
                    {/* You need to implement the logic to populate the departments  */}
                </Picker>

                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    placeholder="Identifiant"
                    value={articleD.Identifiant}
                    onChangeText={(text) => setArticleD({ ...articleD, Identifiant: text })}
                />

                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    placeholder="Mot de passe"
                    value={articleD.Password}
                    onChangeText={(text) => setArticleD({ ...articleD, Password: text })}
                />

                <Button
                    onPress={SignUpFunc}
                    title="S'inscrire"
                    disabled={saveBtnState}
                    style={{ backgroundColor: 'blue', color: 'white' }}
                />  
            
            
        </View>
        </View>
        <BottomCard />
        </ScrollView>
    );
}

export default SignUpPage;
