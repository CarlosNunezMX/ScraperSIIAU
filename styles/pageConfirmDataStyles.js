import { StyleSheet } from "react-native";
import GlobalStyles from "./globalStyles";
import { Dimensions } from "react-native";

const PageConfirmDataStyles = StyleSheet.create({

    container: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: GlobalStyles.firstColor
    },

    subContainerStart: {
        flex: 1
    },


    //Center card
    subContainerCenter: {
        width: Dimensions.get('window').width * 0.7,
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    imageProfile: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 12
    },

    nameText: {
        color: GlobalStyles.textColor2,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 15,
        marginBottom: 2
    },

    schoolText: {
        color: GlobalStyles.textColor2,
        textAlign: "center",
        fontSize: 12,
        marginBottom: 2
    },


    //End card
    subContainerEnd: {
        width: Dimensions.get('window').width * 0.7,
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
        marginBottom: 25
    }, 

    buttonTouch: {
        padding: 10,
        marginVertical: 4,
        width: Dimensions.get('window').width * 0.7,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: GlobalStyles.thirdColor
    },

    buttonText: {
        color: GlobalStyles.textColor2
    }

});

export default PageConfirmDataStyles;