// @ts-ignore
import React from "react";
import {Platform, TouchableNativeFeedback, TouchableOpacity} from "react-native";


export default function TouchableAnyFeedback(props) {
    const {children, ...other} = props;

    const SpecifiedTouchable = Platform.OS === "android" ? TouchableNativeFeedback : TouchableOpacity;

    // @ts-ignore
    return <SpecifiedTouchable {...other}>{children}</SpecifiedTouchable>;
}
