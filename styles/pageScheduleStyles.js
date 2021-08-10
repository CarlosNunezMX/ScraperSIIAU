import { StyleSheet } from "react-native";
import GlobalStyles from "./globalStyles";
import { Dimensions } from "react-native";


const PageScheduleStyles = StyleSheet.create({

    container: {
        display: "flex",
        flex: 1,
        backgroundColor: GlobalStyles.firstColor
    },

    row: {
        display: "flex",
        flexDirection: "row",
        height: (Dimensions.get('window').width - ((Dimensions.get('window').width / 6) * 0.7)) / 6,
        maxHeight: 60
    },

    column: {
        flex: 1,
        borderColor: "#777",
        borderLeftWidth: 0.3,
        borderBottomWidth: 0.3
    },

    hour: {
        borderColor: "#777",
        borderBottomWidth: 0.3,
        borderLeftWidth: 0.3,
        width: (Dimensions.get('window').width / 6) * 0.7,
        justifyContent: "center",
        alignItems: "center"
    },

    hourText: {
        color: "#fff",
        textAlign: "center"
    },

    headerRow: {
        display: "flex",
        flexDirection: "row",
        height: (Dimensions.get('window').width - ((Dimensions.get('window').width / 6) * 0.7)) / 6,
        maxHeight: 40,
        backgroundColor: "#4b4b4b"
    },

    headerElement: {
        flex: 1,
        borderColor: "#777",
        borderBottomWidth: 0.3,
        justifyContent: "center",
        alignItems: "center"
    }
    
});

export default PageScheduleStyles;