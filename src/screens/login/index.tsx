import { SafeAreaView, StyleSheet, View, } from 'react-native';
import React, { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamsList } from '@app/routes';
import { fontFamily } from '@app/constants';
import { Button, Image, Loader, Text, TextField } from '@app/components';
import { Strings } from '@app/strings';
import colors from '@app/colors';
import { LoginApi } from '@app/services';

interface LoginScreenProps {
    navigation: NativeStackNavigationProp<RootStackParamsList, 'Login'>
}

const Login = ({ navigation }: LoginScreenProps) => {

    const [userName, setUserName] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const SetDefaultCredentials = () => {
        setUserName('michael')
        setPassword('success-password')
    }

    const OnClickLogin = () => {
        let body = {
            username: userName,
            password: password
        }
        LoginApi({ setIsLoading, body }).then(()=>{}).catch((err)=>console.log(err))
    }

    return (
        <View style={styles.container}>
            <SafeAreaView />
            <Loader animating={isLoading} />
            <View style={{ alignItems: 'center', marginBottom: 40 }}>
                <Image source={{ uri: "https://knowledgemission.kerala.gov.in/img/official-login.jpg" }} style={{ width: 200, height: 200, }} />
            </View>
            <TextField
                placeholder={Strings.userName}
                value={userName}
                onChangeText={setUserName}
            />
            <TextField
                style={{ marginTop: 10 }}
                placeholder={Strings.password}
                password
                value={password}
                onChangeText={setPassword}
            />
            <Text onPress={SetDefaultCredentials} style={{ marginVertical: 20, textAlign: 'center' }}>Use default credentials</Text>
            <View >
                <Button label={Strings.login} onPress={OnClickLogin} />
            </View>
        </View>
    );
}

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.white,
        justifyContent: 'center'
    }
})