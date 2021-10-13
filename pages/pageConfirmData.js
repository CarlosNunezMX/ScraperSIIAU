import React, { useState } from "react";
import { Text, View, Image, TouchableOpacity, StatusBar } from "react-native";
import * as SecureStore from 'expo-secure-store';


import PageConfirmDataStyles from "../styles/pageConfirmDataStyles";

const PageConfirmData = ({ route, navigation }) => {

    async function goToSchedule(params) {
        await SecureStore.setItemAsync("loged", "true");
        navigation.navigate("Schedule");
    }

    const { MyURI } = route.params;

    return (
        <View style={PageConfirmDataStyles.container} >
            <StatusBar backgroundColor="#222222" />

            <View  style={PageConfirmDataStyles.subContainerStart} />


            <View style={PageConfirmDataStyles.subContainerCenter} >

                <Image key={(new Date()).getTime()} source={{ uri: MyURI }} style={PageConfirmDataStyles.imageProfile} />
                <View>
                    <Text style={PageConfirmDataStyles.nameText} >Nombre Generico Normal</Text>
                    <Text style={PageConfirmDataStyles.schoolText} >Preparatoria No. 6</Text>
                </View>

            </View>


            <View style={PageConfirmDataStyles.subContainerEnd} >

                <TouchableOpacity style={PageConfirmDataStyles.buttonTouch} onPress={() => goToSchedule()} >
                    <Text style={PageConfirmDataStyles.buttonText} >Continuar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={PageConfirmDataStyles.buttonTouch} onPress={() => navigation.goBack()} >
                    <Text style={PageConfirmDataStyles.buttonText} >Volver</Text>
                </TouchableOpacity>

            </View>

        </View>
    );
};

export default PageConfirmData;