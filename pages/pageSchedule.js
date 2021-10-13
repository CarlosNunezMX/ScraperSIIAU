//Libraries used in this page
import React, { Component, useState, useRef } from "react";
import { Text, View, ScrollView, Dimensions, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import TextTicker from 'react-native-text-ticker';
import * as cheerio from "react-native-cheerio";
import * as FileSystem from "expo-file-system";
import * as Network from 'expo-network';
import * as SecureStore from 'expo-secure-store';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

//Styles of this page
import PageScheduleStyles from "../styles/pageScheduleStyles";


//Constants used in this page
const windowWidth = Dimensions.get('window').width;
const colors = ["#ffff92", "#ffb095", "#54e0f5", "#73ff85", "#ffc0ff", "#57ff76", "#e1e2b6", "#ffc4ae", "#c8b3ff", "#9ddbc9"];
const hours = ["07:00 am", "08:00 am", "09:00 am", "10:00 am", "11:00 am", "12:00 am", "01:00 pm", "02:00 pm", "03:00 pm", "04:00 pm", "05:00 pm", "06:00 pm", "07:00 pm", "08:00 pm", "09:00 pm", "10:00 pm"]



//Component of Course
class ScheduleObject extends Component {
    render(){
        
        if ((parseInt(this.props.size) * ((windowWidth - ((windowWidth / 6) * 0.7)) / 6)) >= (60 * parseInt(this.props.size))){
            this.height = 60
        }else{
            this.height = parseInt(this.props.size) * ((windowWidth - ((windowWidth / 6) * 0.7)) / 6);
        }

        if (((windowWidth - ((windowWidth / 6) * 0.7)) / 6) >= 40){
            this.topHeight = 40
        }else{
            this.topHeight = ((windowWidth - ((windowWidth / 6) * 0.7)) / 6);
        }

        this.width = (windowWidth - ((windowWidth / 6) * 0.7)) / 6;
        this.topPosition = parseInt(this.props.top) * (this.height / parseInt(this.props.size));
        this.leftPosition = (parseInt(this.props.left) * this.width) + ((windowWidth / 6) * 0.7);
        this.containerStyle = StyleSheet.create({
            container: {
                backgroundColor: this.props.color,
                top: this.topPosition + 0.5 + this.topHeight,
                left: this.leftPosition + 0.5,
                height:  this.height - 1,
                position: "absolute",
                justifyContent: "center",
                alignItems: "center",
                width: this.width - 1,
                padding: 3,
                borderRadius: 2
            }
        });
        return (
            <TouchableOpacity style={this.containerStyle.container} onPress={() => {this.props.navigation.navigate("ScheduleData", { object: this.props.object, name: this.props.name })}}>
                <TextTicker style={{fontSize: 10}} scrollSpeed={100} marqueeDelay={5000}> {this.props.name} </TextTicker>
            </TouchableOpacity>
        )
    }
}


//Page
const PageSchedule = ({ navigation }) => {

    const [schedule, setSchedule] = useState({});

    async function getSchedule(){

        let codeText = await SecureStore.getItemAsync("code");
        let passText = await SecureStore.getItemAsync("password");

        let lginResult = await fetch("http://siiauescolar.siiau.udg.mx/wus/gupprincipal.valida_inicio", {method: "POST", body: "p_codigo_c=" + codeText + "&p_clave_c=" + passText});
        let loginText = await lginResult.text();

        let $1 = cheerio.load(loginText);
        let myId = $1('input[name="p_bienvenida_c"]').attr("value");
        
        let scheduleResult = await fetch("http://siiauescolar.siiau.udg.mx/wal/sgpregi.horario?pidmp=" + myId + "&majrp=BGC");
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
        setSchedule(jsonData);
            

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

    async function loadJsonData() {

        let conectionStatues = await Network.getNetworkStateAsync();

        if (conectionStatues["isInternetReachable"]){

            await getSchedule();

        }else{
            
            let filename = FileSystem.documentDirectory + "scheduleData.json";
            let fileExist = await FileSystem.getInfoAsync(filename)

            if (fileExist["exists"]){

                let file = await FileSystem.readAsStringAsync(filename, { encoding: FileSystem.EncodingType.UTF8 });
                setSchedule(JSON.parse(file));

            }else{

                console.log("No existe el archivo")

            }
            
        
        }
    }

    loadJsonData()

    return (
        <View style={PageScheduleStyles.container}>
            <StatusBar backgroundColor="#4b4b4b" />
            <ScrollView>
            
            <View style={PageScheduleStyles.headerRow}>
                
                <View style={PageScheduleStyles.hour}>
                    <FontAwesomeIcon icon={faClock} style={PageScheduleStyles.hourText} />
                </View>
                <View style={PageScheduleStyles.headerElement}>
                    <Text style={PageScheduleStyles.hourText} > Lun </Text>
                </View>
                <View style={PageScheduleStyles.headerElement}>
                    <Text style={PageScheduleStyles.hourText} > Mar </Text>
                </View>
                <View style={PageScheduleStyles.headerElement}>
                    <Text style={PageScheduleStyles.hourText} > Mié </Text>
                </View>
                <View style={PageScheduleStyles.headerElement}>
                    <Text style={PageScheduleStyles.hourText} > Jue </Text>
                </View>
                <View style={PageScheduleStyles.headerElement}>
                    <Text style={PageScheduleStyles.hourText} > Vie </Text>
                </View>
                <View style={PageScheduleStyles.headerElement}>
                    <Text style={PageScheduleStyles.hourText} > Sab </Text>
                </View>
            </View>

            {hours.map((thisHour, index) => {
                return(
                    <View style={PageScheduleStyles.row} key={index} >
                        <View style={PageScheduleStyles.hour}>
                            <Text style={PageScheduleStyles.hourText} > {thisHour} </Text>
                        </View>
                        <View style={PageScheduleStyles.column}/>
                        <View style={PageScheduleStyles.column}/>
                        <View style={PageScheduleStyles.column}/>
                        <View style={PageScheduleStyles.column}/>
                        <View style={PageScheduleStyles.column}/>
                        <View style={PageScheduleStyles.column}/>
                    </View>
                );
            })}
            
            {/* No estoy seguro, pero parece que el error esta en el size, debo recalcular la formula y revisar porque falla */}

            {Object.keys(schedule).map((text, index) => { 
                return(schedule[text]["Horario"].map((text2) => {

                    let left = "";
                    switch(text2["Dia"]){
                        case "L":
                            left = "0"; break;
                        case "M":
                            left = "1"; break;
                        case "I":
                            left = "2"; break;
                        case "J":
                            left = "3"; break;
                        case "V":
                            left = "4"; break;
                        case "S":
                            left = "5"; break;
                    }

                    let top = parseInt(text2["Horario"].substring(0,2)) - 7
                    let color = colors[index]
                    let size = 1 + (parseInt(text2["Horario"].substring(5,7)) - parseInt(text2["Horario"].substring(0,2)))

                    return(
                        <ScheduleObject key={(top+left).toString()} name={text} color={color} size={size.toString()} top={top.toString()} left={left} navigation={navigation} object={schedule[text]} />
                    )
                }))
             })}

            </ScrollView>
        </View>
    );
};

export default PageSchedule;