import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    Text
} from 'react-native'

import Color from '@common/color'
import FloatLabelTextInput from '@components/general/floatingLabelInput';
import RoundButton from '@components/general/roundButton'

export default class VerifyNumber extends PureComponent {
    constructor(props){
        super(props)
    }

    done(){

    }

    render() {
        return (
            <View style={styles.container}>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white',
        padding:20,
    },
    inputContainer:{
        height:50,
        width:'100%',
        marginTop:40
    },
    description:{
        fontSize:18,
        color:Color.lightText,
        textAlign:'center'
    },
    button:{
        marginTop:20
    },
    buttonText:{
        fontWeight:'bold'
    },
    input:{
        color:Color.primary
    }
})