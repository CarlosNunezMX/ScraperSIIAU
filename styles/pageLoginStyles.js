import { StyleSheet } from "react-native";
import GlobalStyles from "./globalStyles";
import { Dimensions } from "react-native";

const PageLoginStyles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: GlobalStyles.firstColor
    },

    overlay: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 1.05,
        position: "absolute",
        top: 0,
        left: 0,
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: "rgba(40, 40, 40, 0.8)"
    },

    subContainer: {
        width: Dimensions.get('window').width * 0.7
    },

    logoImage: {
        width: 70,
        height: 70,
        borderRadius: 35
    },

    logoView: {
        marginBottom: 12,
        alignItems: "center"
    },

    input: {
        padding: 10,
        color: GlobalStyles.textColor,
        flex: 1,
        minWidth: 100
    },

    inputIcon: {
        marginLeft: 10,
        color: GlobalStyles.textColor3,
        minWidth: 10,
        alignSelf: "center"
    },

    inputView: {
        backgroundColor: GlobalStyles.secondColor,
        marginVertical: 6,
        borderRadius: 5,
        flexDirection: "row"
    },

    inputHideTouch: {
        alignItems: "flex-end",
        justifyContent: "center",
        width: 35
    },

    inputHideIcon: {
        color: GlobalStyles.textColor3,
        marginRight: 10
    },

    buttonView: {
        marginVertical: 6,
        backgroundColor: GlobalStyles.thirdColor,
        borderRadius: 5
    },

    buttonIcon: {
        marginRight: 3,
        color: GlobalStyles.textColor2,
        height: 17
    },

    buttonTouch: {
        padding: 12,
        width: Dimensions.get('window').width * 0.7,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row"
        
    },

    buttonText: {
        color: GlobalStyles.textColor2
    }

});

export default PageLoginStyles;