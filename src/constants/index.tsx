import { Platform } from "react-native";

export const fontFamily = {
    black: Platform.OS == "ios" ? 'Outfit-Black' : 'Outfit-Black',
    medium: Platform.OS == "ios" ? 'Outfit-Medium' : 'Outfit-Medium',
    regular: Platform.OS == "ios" ? 'Outfit-Regular' : 'Outfit-Regular',
    bold: Platform.OS == "ios" ? 'Outfit-Bold' : 'Outfit-Bold',
    light: Platform.OS == "ios" ? 'Outfit-Light' : 'Outfit-Light',
    thin: Platform.OS == "ios" ? 'Outfit-Thin' : 'Outfit-Thin',
}

export const DATE_TIME_FORMARTS = {
    ddmmyyyy: "DD/MM/YYYY",
    timeInAMPM: "hh:mm A",
    ddmmmyyyAMPM: 'DD MMM YYYY, hh:mm A',
    dmmmmyyyAMPM: 'D MMMM YYYY, hh:mm A',
    yyyymmdd: 'YYYY-MM-DD',
    llll: 'llll',
    dateTimeInAMPM: "DD MMM YYYY, hh:mm A"
}