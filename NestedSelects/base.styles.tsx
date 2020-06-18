// @ts-ignore
import React from "react";
import {StyleSheet} from "react-native";

import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

export default StyleSheet.create({
    wrapper: {
        alignSelf: "center",
        maxHeight: hp(80),
        width: wp(80),
        justifyContent: "center",
        backgroundColor: "#fff",
        paddingVertical: 10,
    },
    button: {
        alignItems: "center",
        width: "100%",
        paddingVertical: 15,
    },
    buttonText: {
        fontSize: Math.min(14, wp(5)),
        color: "#555",
        textAlign: "center",
    }
})
