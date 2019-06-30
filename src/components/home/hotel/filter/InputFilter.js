import React from 'react'

import {
    View,
    Text,
    StyleSheet,
    TextInput
} from 'react-native'

import Color from '@common/color'
import TitleBar from './TitleBar';
import Global from "@utils/global";
const {T1, T2} = Global.Translate

export default InputFilter = ({ title, value, onChanged }) => (
    <View style={styles.container}>
        <TitleBar title={title}/>
        <View style={styles.content}>
            <Text style={styles.title}>{title||T2('Hotel Name')}</Text>
            <TextInput
                autoCapitalize='none'
                autoCorrect={false}
                underlineColorAndroid='transparent'
                onChangeText={text=>onChanged(text)}
                value={value}
                style={styles.input}
            />
            <View style={styles.underLine}/>
        </View>
    </View>
)

const styles = StyleSheet.create({
    container: {
    },
    content:{
        padding:15
    },
    underLine:{
        width:'100%',
        height:0.5,
        backgroundColor: Color.border
    },
    input:{
        
        marginTop:10,
        height:30
    },
    title:{
        fontSize:12,
        color:Color.lightText
    }
})