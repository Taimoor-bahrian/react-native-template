import { View, SafeAreaView, TouchableOpacity } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import {  Home, Login, Profile, } from '@app/screens';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Colors from '@app/colors';
import { Image } from '@app/components';
import { Assets } from '@app/assets';

export type RootStackParamsList = {
    Signup: undefined,
    Login: undefined
};

const Stack = createNativeStackNavigator<RootStackParamsList>();
const Tab = createBottomTabNavigator();
const headerShownFalse = { headerShown: false, orientation: 'portrait' }

const Routes = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false, }}>
                <Stack.Screen name='Login' component={Login} />
                <Stack.Screen name='Signup' component={TabBar} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const TabBar = () => {

    return (
        <Tab.Navigator screenOptions={headerShownFalse} tabBar={props => <Tabs {...props} />}>
            <Tab.Screen name='Home' component={Home} />
            <Tab.Screen name='Profile' component={Profile} />
        </Tab.Navigator>
    )
}

const Tabs = ({ state, navigation }: any) => {

    return (
        <>
            <View style={{ paddingTop: 0 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: Colors.white }}>
                    {state.routes.map((route: any, index: number) => {
                        const isFocused = state.index === index;
                        const onPress = () => {
                            index === 0 ?
                                navigation.navigate('Home')
                                :  navigation.navigate('Profile')
                        };

                        return (
                            <TouchableOpacity onPress={onPress} style={{ padding: 15 }}>
                                {index === 0 ?
                                    <Image source={Assets.trails} style={{ width: 30, height: 30 }} tintColor={isFocused ? Colors.primaryRed : Colors.black} />
                                    
                                                : <Image source={Assets.more} style={{ width: 30, height: 30 }} tintColor={isFocused ? Colors.primaryRed : Colors.black} />

                                }
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
            <SafeAreaView style={{ backgroundColor: Colors.white }} />
        </>
    );
};


export default Routes;
