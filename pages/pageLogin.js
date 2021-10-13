//Librerias
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Image, ActivityIndicator, ToastAndroid, Platform, AlertIOS, StatusBar } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEye, faEyeSlash, faUser, faLock, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import * as cheerio from "react-native-cheerio";
import * as FileSystem from "expo-file-system";
import * as Network from 'expo-network';
import * as SecureStore from 'expo-secure-store';



//Modulo de estilos
import PageLoginStyles from "../styles/pageLoginStyles";




//FUncion principal de la pagina
const PageLogin = ({ navigation }) => {

    //Estados de la pagina
    const [hidePassword, setHidePassword] = useState(true);
    const [hidePasswordIcon, setHidePasswordIcon] = useState(faEye);
    const [overlayDisplay, setOverlayDisplay] = useState(false);
    const [codeText, setCodeText] = useState("");
    const [passText, setPassText] = useState("");
    


    //Funciones de la pagina
    async function checkLogin(){

        setOverlayDisplay(true);
        let conectionStatues = await Network.getNetworkStateAsync();
        
        if (conectionStatues["isInternetReachable"]){

            
            let lginResult = await fetch("http://siiauescolar.siiau.udg.mx/wus/gupprincipal.valida_inicio", {method: "POST", body: "p_codigo_c=" + codeText + "&p_clave_c=" + passText});
            let loginText = await lginResult.text();

            let $ = cheerio.load(loginText);
            let myId = $('input[name="p_bienvenida_c"]').attr("value");
            await SecureStore.setItemAsync("code", codeText);
            await SecureStore.setItemAsync("password", passText);
            myId !== undefined ? getSchedule(myId) : errorOcurred("Error al inciar sesion");            

        }else{
            errorOcurred("Error de conexión")
        }
            
    }


    async function getSchedule(siiauID){

        let scheduleResult = await fetch("http://siiauescolar.siiau.udg.mx/wal/sgpregi.horario?pidmp=" + siiauID + "&majrp=BGC");
        let scheduleText = await scheduleResult.text();

        let $ = cheerio.load(scheduleText);
        let table = $('TABLE[ALIGN="CENTER"]>tbody').find("tr");
        let lastCourse = "";
        let jsonData = {};

        table.map( (index, object) => {  if(index >= 2){

            let corseLength = $(object).children().length;
            let childs = $(object).find("td")
            
            if (corseLength === 17){

                let courseName = toCapitalLetter( $(childs.get(2)).text() );
                lastCourse = courseName;
                jsonData[courseName] = {}
                jsonData[courseName]["NRC"] = $(childs.get(0)).text()
                jsonData[courseName]["Clave"] = $(childs.get(1)).text()
                jsonData[courseName]["Seccion"] = $(childs.get(3)).text()
                jsonData[courseName]["Creditos"] = $(childs.get(4)).text()
                jsonData[courseName]["Profesor"] = $(childs.get(14)).text()
                jsonData[courseName]["Inicio"] = $(childs.get(15)).text()
                jsonData[courseName]["Fin"] = $(childs.get(16)).text()
                jsonData[courseName]["Horario"] = []

                jsonDay = {}

                let i = 6

                while(i <= 11){
                    if ($(childs.get(i)).text() !== ""){

                        jsonDay["Dia"] = $(childs.get(i)).text();
                        i = 12;
                    }
                    i += 1;
                }
                jsonDay["Horario"] = $(childs.get(5)).text();
                jsonDay["Edificio"] = $(childs.get(12)).text();
                jsonDay["Aula"] = $(childs.get(13)).text();
                jsonData[courseName]["Horario"].push(jsonDay);

            }else if(corseLength === 13){

                jsonDay = {}
                i = 2

                while (i <= 7){
                    if ($(childs.get(i)).text() !== ""){
                        jsonDay["Dia"] = $(childs.get(i)).text()
                        i = 8;
                    }
                    i += 1
                    
                }

                jsonDay["Horario"] = $(childs.get(1)).text();
                jsonDay["Edificio"] = $(childs.get(8)).text();
                jsonDay["Aula"] = $(childs.get(9)).text();
                jsonData[lastCourse]["Horario"].push(jsonDay);
                

            }


        }});

        
        await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + "scheduleData.json", JSON.stringify(jsonData), { encoding: FileSystem.EncodingType.UTF8 })
            .then(() => getImage())
            .catch(() => errorOcurred("Error al obtener informacion"))

    }

    function toCapitalLetter(oldString){

        let myString = oldString.split(" ");
        let myNewString = "";

        myString.map((value, index) => {
            
            if (value === "III" || value === "I" || value === "II" || value === "IV" || value === "V" || value === "VI"){
                myNewString += (value + " ");
            }else if(value === "Y" || value === "DE" || value === "DEL" || value === "LA"){
                myNewString += (value.toLowerCase() + " ");
            }else{
                myNewString += value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() + " "
            }

        })

        return myNewString.slice(0, -1);
    }



    async function getImage(){

        await fetch("http://ttom6.siiau.udg.mx/siiaun/Login.jsp", {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: "UserName="+codeText+"&psw="+passText
        })
            .catch(() => errorOcurred("Error al obtener informacion"))


        let imageResult = await fetch("http://ttom6.siiau.udg.mx/siiaun/EVALUMGEN/vista.jsp?Modulo=Rol=ALUMNOS&DEMENU=1&Modulo=EVALUMGEN");
        let imageText = await imageResult.text();

        let $ = cheerio.load(imageText);
        let imageURL = $('img[name="imagen"]').attr("src");
        let newImageURL = imageURL.substring(1).substring(1);

        await FileSystem.downloadAsync("http://ttom6.siiau.udg.mx/siiaun" + newImageURL, FileSystem.documentDirectory + "imageProfile_" + codeText + ".jpg")
            .then(({ uri }) => { setOverlayDisplay(false); navigation.navigate("ConfirmData", { MyURI: uri }) })
            .catch(() => errorOcurred("Error al obtener informacion"))
    }


    function errorOcurred(msg){
        setOverlayDisplay(false);
        console.log(msg, codeText, passText);
        if (Platform.OS === 'android'){
            ToastAndroid.show(msg, ToastAndroid.SHORT);
        } else {
            AlertIOS.alert(msg);
        }
    }


    //Estructura de la pagina
    return (
        <View style={PageLoginStyles.container} >
            <StatusBar backgroundColor="#222222" />
            <View style={PageLoginStyles.subContainer}>


                <View style={PageLoginStyles.logoView} >
                    <Image style={PageLoginStyles.logoImage} source={require("../assets/icon.png")} />
                </View>


                <View style={PageLoginStyles.inputView}>
                    <FontAwesomeIcon icon={faUser} style={PageLoginStyles.inputIcon} />
                    <TextInput style={PageLoginStyles.input} placeholder="Codigo" placeholderTextColor="#808080" maxLength={9} keyboardType="number-pad" onChangeText={(value) => setCodeText(value)} />
                </View>


                <View style={PageLoginStyles.inputView}>
                    <FontAwesomeIcon icon={faLock} style={PageLoginStyles.inputIcon} />
                    <TextInput style={PageLoginStyles.input} placeholder="Contraseña" placeholderTextColor="#808080" maxLength={10} secureTextEntry={hidePassword} onChangeText={(value) => setPassText(value)} />
                    <TouchableOpacity style={PageLoginStyles.inputHideTouch} onPress={() => {setHidePassword(!hidePassword); hidePasswordIcon == faEye ? setHidePasswordIcon(faEyeSlash) : setHidePasswordIcon(faEye)}} >
                        <FontAwesomeIcon icon={hidePasswordIcon} style={PageLoginStyles.inputHideIcon} />
                    </TouchableOpacity>
                </View>


                <View style={PageLoginStyles.buttonView} >
                    <TouchableOpacity style={PageLoginStyles.buttonTouch} onPress={() => checkLogin()} >
                        <FontAwesomeIcon icon={faSignInAlt} style={PageLoginStyles.buttonIcon} />
                        <Text style={PageLoginStyles.buttonText}> Iniciar sesión </Text>
                    </TouchableOpacity>
                </View>


            </View>

            {overlayDisplay ?
                <View style={PageLoginStyles.overlay}>
                    <ActivityIndicator size="large" color="#dedede"/>
                </View>
            : null}
        
        </View>
    );
};


//Exportar funcion principal
export default PageLogin;