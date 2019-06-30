import React, {PureComponent} from 'react'
import {
    TouchableOpacity,
    StyleSheet,
    Text,
    ActivityIndicator
} from 'react-native'
import Color from '@common/color'
import {Ionicons} from '@expo/vector-icons'

export default class CheckButton extends PureComponent{
    render(){
        let {value, onPress, containerStyle, size, color} = this.props
        return(
            <TouchableOpacity style={[styles.container,containerStyle]} onPress={onPress}>
                {value&&<Ionicons name="md-checkmark" size={size||18} color={color||Color.orange}/>}
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        width:18,
        height:18,
        backgroundColor:'#ccc',
        justifyContent:'center',
        alignItems:'center'
    }
})