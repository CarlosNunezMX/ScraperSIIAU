import React from "react";
import { Button, Text, View, StatusBar } from "react-native";
import * as FileSystem from "expo-file-system";
import * as SecureStore from 'expo-secure-store';


const PageScheduleData = ({ route, navigation }) => {

    const { object, name } = route.params;

    return (
        <View>
            <StatusBar backgroundColor="#4b4b4b" />
            <Text> {JSON.stringify(name)} </Text>
            <Text> {JSON.stringify(object)} </Text>
        </View>
    );
};

export default PageScheduleData;