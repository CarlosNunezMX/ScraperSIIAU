import React from "react";
import { Button, Text, View } from "react-native";
import * as FileSystem from "expo-file-system";
import * as SecureStore from 'expo-secure-store';


const PageScheduleData = ({ route, navigation }) => {

    const { object, name } = route.params;

    return (
        <View>
            <Text> {JSON.stringify(name)} </Text>
            <Text> {JSON.stringify(object)} </Text>
        </View>
    );
};

export default PageScheduleData;