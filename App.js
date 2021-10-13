//Librerias
import React, { useEffect,useState } from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { NavigationContainer } from "@react-navigation/native"
import { BackHandler, View } from 'react-native';
import * as FileSystem from "expo-file-system";
import * as SecureStore from 'expo-secure-store';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Button } from 'react-native-elements';

//Componentes
import PageLogin from "./pages/pageLogin";
import PageConfirmData from './pages/pageConfirmData';
import PageSchedule from "./pages/pageSchedule"
import PageScheduleData from "./pages/pageScheduleData";

//Constantes
const Stack = createStackNavigator();



//APP
export default function App() {

  const [mainPage, setMainPage] = useState("Schedule");

  async function checkDiviceInfo() {
    let codeInDivice = await SecureStore.getItemAsync("loged");
    if(codeInDivice){
      setMainPage("Schedule");
    }
  } 
  checkDiviceInfo();

  useEffect(() => {
    const backAction = () => {

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={mainPage} screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}>
        
        <Stack.Screen name="Login" component={PageLogin} options={{headerShown: false}} />
        <Stack.Screen name="ConfirmData" component={PageConfirmData} options={{headerShown: false}} />
        <Stack.Screen name="Schedule" component={PageSchedule} options={({ navigation, route }) => ({ title: "Horario", headerTitleStyle: { color: "#fff" }, headerStyle: { backgroundColor: "#4b4b4b" }, headerLeft: () =>  <Button containerStyle={{ paddingLeft:15 }} buttonStyle={{ backgroundColor: "#00000000" }} onPress={async () => { await FileSystem.deleteAsync(FileSystem.documentDirectory + "imageProfile.jpg", { idempotent: true });
        await FileSystem.deleteAsync(FileSystem.documentDirectory + "scheduleData.json", { idempotent: true });
        await SecureStore.deleteItemAsync("code");
        await SecureStore.deleteItemAsync("password");
        await SecureStore.deleteItemAsync("loged");
        navigation.navigate("Login"); }} icon={ <FontAwesomeIcon icon={faBars} style={{ color: "#fff" }} /> } /> }) }/>
        <Stack.Screen name="ScheduleData" component={PageScheduleData}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}