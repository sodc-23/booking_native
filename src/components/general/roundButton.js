import React, {PureComponent} from 'react'
import {
    TouchableOpacity,
    StyleSheet,
    Text,
    ActivityIndicator
} from 'react-native'
import Color from '@common/color'
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default class RoundButton extends PureComponent{
    render(){
        let {style, title, onPress, isLoading, disabled, disabledUI, textStyle, bold, type} = this.props
        return(
            <TouchableOpacity disabled={disabled} style={[styles.container,style, disabledUI?styles.disabled:{}]} onPress={onPress}>
                {isLoading&&<ActivityIndicator color='white' style={styles.spinner}/>}
                {type=='facebook'&&<FontAwesome name="facebook" size={20} color="white" style={{marginRight:20}}/>}
                {type=='google'&&<FontAwesome name="google-plus" size={20} color="white" style={{marginRight:20}}/>}
                <Text style={[styles.buttonText, textStyle, bold?{fontWeight:'bold'}:{}]}>{title}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        width:'100%',
        height:44,
        borderRadius:22,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: Color.orange,
        flexDirection:'row'
    },
    buttonText:{
        fontSize:14,
        color:'white',
        // fontWeight:'bold'
    },
    spinner:{
        marginRight:10,
    },
    disabled:{
        backgroundColor:'grey'
    }
})