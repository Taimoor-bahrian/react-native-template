import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';
import Text from '@app/components/text';
import colors from '@app/colors';
import Ionicons from 'react-native-vector-icons/Ionicons'

const TextField = (props: any) => {
    
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(props?.password);

    const togglePassword = () => setIsPasswordVisible(!isPasswordVisible);

    return (
        <>
            <TextInput
                mode='outlined'
                theme={{ roundness: 12, colors: { background: colors.white, } }}
                textColor={colors.black}
                autoCapitalize={props?.password ? "none" : "sentences"}
                activeOutlineColor={colors.blueGrey3}
                outlineColor={colors.blueGrey3}
                placeholderTextColor={colors.textColor}
                secureTextEntry={props?.password ? isPasswordVisible : false}
                right={props.password ? <TextInput.Icon onPress={togglePassword} icon={() => isPasswordVisible ? <Ionicons name='eye-off' size={18} color={colors.blueGrey3} /> : <Ionicons name="eye" size={18} color={colors.blueGrey3} />} /> : null}
                {...props}
            />
            {props?.error && <Text style={{ marginTop: 5, color: colors.primaryRed, marginLeft: 5 }}>{props?.error}</Text>}
        </>
    );
}

export default TextField;
