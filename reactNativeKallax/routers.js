import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingPage from './Routing/Landing/landingPage';
import ProfessionnelInfoPage from './Routing/Professionnel/professionnelInfo';
import ProfessionnelListePage from './Routing/Professionnel/professionnelListe';
import SignUpPage from './Users/signUpPage';
import UserLogIn from './Users/loginPage';
import CompteProPage from './Users/compteProPage';
import UserLandingPage from './Users/userLandingPage';
import UserDemmandeInfo from './Users/Demmande/demmandeInfo';
import UserPaymmentPage from './Users/Paymment/paymmentPage';
import SuccessPaymmentCard from './Users/Paymment/successPage';
import CancelPaymmentCard from './Users/Paymment/cancelPage';
import ProfLandingPage from './Professionnel/profLandingPage';
import ProfDemmandeList from './Professionnel/Demmande/demmandeList';
import ProfDemmandeAction from './Professionnel/Demmande/demmandeAction';
import ProfPaymmentPage from './Professionnel/Paymment/paymmentPage';
import ProfCalendarPage from './Professionnel/Calendar/calendarPage';
import ProfComunautePage from './Professionnel/Communite/communitePage';
import FinanceSetting from './Professionnel/Parametre/finance';
import PhotoesSetting from './Professionnel/Parametre/photo';
import InfoGeneraleSetting from './Professionnel/Parametre/infoGenerale';
import HoraireSetting from './Professionnel/Parametre/horaire';
import PositionsSetting from './Professionnel/Parametre/position';
import TarificationSetting from './Professionnel/Parametre/tarif';

const Stack = createNativeStackNavigator();

const App = () => {
  const [progress, setProgress] = useState(2);

  useEffect(() => {
    setProgress(100);
  }, []);

  const NotFound = () => {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'red', fontSize: 24 }}>Page Introuvable 404</Text>
        <Image source={{ uri: 'https://assets.ansl.tn/images/old/404.svg' }} style={{ width: 200, height: 200 }} />
      </View>
    );
  };

  return (
    <NavigationContainer>
      <StatusBar barStyle="default" />
      <Stack.Navigator initialRouteName="LandingPage">
        <Stack.Screen name="LandingPage" component={LandingPage} />
        <Stack.Screen name="ProfessionnelInfoPage" component={ProfessionnelInfoPage} />
        <Stack.Screen name="ProfessionnelListePage" component={ProfessionnelListePage} />
        <Stack.Screen name="SignUpPage" component={SignUpPage} />
        <Stack.Screen name="UserLogIn" component={UserLogIn} />
        <Stack.Screen name="CompteProPage" component={CompteProPage} />
        <Stack.Screen name="UserLandingPage" component={UserLandingPage} />
        <Stack.Screen name="UserDemmandeInfo" component={UserDemmandeInfo} />
        <Stack.Screen name="UserPaymmentPage" component={UserPaymmentPage} />
        <Stack.Screen name="SuccessPaymmentCard" component={SuccessPaymmentCard} />
        <Stack.Screen name="CancelPaymmentCard" component={CancelPaymmentCard} />
        <Stack.Screen name="ProfLandingPage" component={ProfLandingPage} />
        <Stack.Screen name="ProfDemmandeList" component={ProfDemmandeList} />
        <Stack.Screen name="ProfDemmandeAction" component={ProfDemmandeAction} />
        <Stack.Screen name="ProfPaymmentPage" component={ProfPaymmentPage} />
        <Stack.Screen name="ProfCalendarPage" component={ProfCalendarPage} />
        <Stack.Screen name="ProfComunautePage" component={ProfComunautePage} />
        <Stack.Screen name="FinanceSetting" component={FinanceSetting} />
        <Stack.Screen name="PhotoesSetting" component={PhotoesSetting} />
        <Stack.Screen name="InfoGeneraleSetting" component={InfoGeneraleSetting} />
        <Stack.Screen name="HoraireSetting" component={HoraireSetting} />
        <Stack.Screen name="PositionsSetting" component={PositionsSetting} />
        <Stack.Screen name="TarificationSetting" component={TarificationSetting} />
        <Stack.Screen name="NotFound" component={NotFound} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
