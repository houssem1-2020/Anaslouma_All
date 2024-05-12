import React, { useEffect, useState } from 'react';
import { Image, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator  } from '@react-navigation/native-stack';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Provider } from 'react-redux';
import store from './src/AssetsM/redux/store'; 
import LandingPage from './src/main';
import AddDemmande from './src/Routing/addDemmandes';
// import ProfessionnelListePage from './Routing/Professionnel/professionnelListe';
import SignUpPage from './src/Users/signUpPage';
import UserLogIn from './src/Users/loginPage';
// import CompteProPage from './Users/compteProPage';
import UserLandingPage from './src/Users/userLandingPage';
// import UserDemmandeInfo from './Users/Demmande/demmandeInfo';
// import UserPaymmentPage from './Users/Paymment/paymmentPage';
// import SuccessPaymmentCard from './Users/Paymment/successPage';
// import CancelPaymmentCard from './Users/Paymment/cancelPage';
import ProfLandingPage from './src/Professionnel/profLandingPage';
import { Appbar } from 'react-native-paper';
import styles from './src/AssetsM/theme';
import { useNavigation } from '@react-navigation/native';
import { Platform, Alert } from 'react-native';
// import PushNotificationIOS from '@react-native-community/push-notification-ios';
// import PushNotification from 'react-native-push-notification';

// import ProfDemmandeList from './Professionnel/Demmande/demmandeList';
// import ProfDemmandeAction from './Professionnel/Demmande/demmandeAction';
// import ProfPaymmentPage from './Professionnel/Paymment/paymmentPage';
// import ProfCalendarPage from './Professionnel/Calendar/calendarPage';
// import ProfComunautePage from './Professionnel/Communite/communitePage';
// import FinanceSetting from './Professionnel/Parametre/finance';
// import PhotoesSetting from './Professionnel/Parametre/photo';
// import InfoGeneraleSetting from './Professionnel/Parametre/infoGenerale';
// import HoraireSetting from './Professionnel/Parametre/horaire';
// import PositionsSetting from './Professionnel/Parametre/position';
// import TarificationSetting from './Professionnel/Parametre/tarif';

const Stack = createNativeStackNavigator();


const App = () => {
  const [progress, setProgress] = useState(2);
  
  useEffect(() => {
    setProgress(100);
    // Request permission to show notifications
    // if (Platform.OS === 'ios') {
    //   PushNotificationIOS.requestPermissions();
    // } else {
    //   PushNotification.requestPermissions();
    // }
  }, []);

  const checkIfStored = async () => {
    const value = await AsyncStorage.getItem('UserData');
    console.log(value)
    if (value) { return  true }
    else  { return false }

    // try {
    //   const value = await AsyncStorage.getItem('UserData');
    //   if (value !== null) {
    //      alert(value);
    //   } else {
    //      alert('Key Not Found', 'The key "kkggd" is not stored in AsyncStorage.');
    //   }
    // } catch (error) {
    //   console.error('Error checking storage:', error);
    // }
  };

  

  const NotFound = () => {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'red', fontSize: 24 }}>Page Introuvable 404</Text>
        <Image source={{ uri: 'https://assets.ansl.tn/images/old/404.svg' }} style={{ width: 200, height: 200 }} />
      </View>
    );
  };

  const TopNavBar = () => {
    const navigation = useNavigation();
    return (
      <Appbar style={styles.navBar}>
         
        <Appbar.Content titleStyle={{ color: '#FFFFFF' }}  title="Kallax-s.fr" />
         
        <Appbar.Action 
            icon={({ color, size }) => (
              <View style={styles.containerUser}>
                <TouchableOpacity  style={styles.imageContainer} onPress={() => navigation.navigate('UserLandingPage')}>
                  <Image
                    source={{uri:`https://assets.ansl.tn/Images/kallax/user.gif`}} // Replace with the path to your image
                    style={{ width: 25, height: 25 }}
                  />
                </TouchableOpacity >
              </View>
        )}
        onPress={() => {}}
      />
    
      </Appbar>  )
  }

  const SpesificAppBar = () => {
    const navigation = useNavigation();
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
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar barStyle="default" />
        <Stack.Navigator initialRouteName={checkIfStored ? 'AddDemmande' : 'UserLogIn'} >

          <Stack.Screen options={{ headerShown: true, header: () => <TopNavBar />    }} name="LandingPage" component={LandingPage} />
          <Stack.Screen options={{ headerShown: true , header: () => <SpesificAppBar />  }} name="AddDemmande" component={AddDemmande} />

          {/* <Stack.Screen options={{ headerShown: false }} name="ProfessionnelListePage" component={ProfessionnelListePage} /> */}
          <Stack.Screen options={{ headerShown: false }} name="SignUpPage" component={SignUpPage} />
          <Stack.Screen options={{ headerShown: false }} name="UserLogIn" component={UserLogIn} />
          {/*<Stack.Screen options={{ headerShown: false }} name="CompteProPage" component={CompteProPage} />*/}
          <Stack.Screen options={{ headerShown: false , header: () => <SpesificAppBar /> }} name="UserLandingPage" component={UserLandingPage} />
          {/*<Stack.Screen options={{ headerShown: false }} name="UserDemmandeInfo" component={UserDemmandeInfo} />
          <Stack.Screen options={{ headerShown: false }} name="UserPaymmentPage" component={UserPaymmentPage} />
          <Stack.Screen options={{ headerShown: false }} name="SuccessPaymmentCard" component={SuccessPaymmentCard} />
          <Stack.Screen options={{ headerShown: false }} name="CancelPaymmentCard" component={CancelPaymmentCard} /> */}
          <Stack.Screen options={{ headerShown: false }} name="ProfLandingPage" component={ProfLandingPage} />
          {/*<Stack.Screen options={{ headerShown: false }} name="ProfDemmandeList" component={ProfDemmandeList} />
          <Stack.Screen options={{ headerShown: false }} name="ProfDemmandeAction" component={ProfDemmandeAction} />
          <Stack.Screen options={{ headerShown: false }} name="ProfPaymmentPage" component={ProfPaymmentPage} />
          <Stack.Screen options={{ headerShown: false }} name="ProfCalendarPage" component={ProfCalendarPage} />
          <Stack.Screen options={{ headerShown: false }} name="ProfComunautePage" component={ProfComunautePage} />
          <Stack.Screen options={{ headerShown: false }} name="FinanceSetting" component={FinanceSetting} />
          <Stack.Screen options={{ headerShown: false }} name="PhotoesSetting" component={PhotoesSetting} />
          <Stack.Screen options={{ headerShown: false }} name="InfoGeneraleSetting" component={InfoGeneraleSetting} />
          <Stack.Screen options={{ headerShown: false }} name="HoraireSetting" component={HoraireSetting} />
          <Stack.Screen options={{ headerShown: false }} name="PositionsSetting" component={PositionsSetting} />
          <Stack.Screen options={{ headerShown: false }} name="TarificationSetting" component={TarificationSetting} /> */}
          <Stack.Screen options={{ headerShown: false }} name="NotFound" component={NotFound} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
