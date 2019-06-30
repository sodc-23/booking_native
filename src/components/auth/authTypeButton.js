import React, {PureComponent} from 'react'
import {
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native'
import Color from '@common/color'
import {Ionicons} from '@expo/vector-icons'
import {LinearGradient} from 'expo'
import {messageWhite, messageGreen, mobileWhite, mobileGreen} from '@common/image'

export default class AuthTypeButton extends PureComponent{
    render(){
        let {icon, onPress, selected} = this.props
        // const name=icon=='email'?"ios-mail":'ios-phone-portrait'
        // const color = selected?'white':Color.lightPrimary
        const iconImage=icon=='email'?(selected?messageWhite:messageGreen):(selected?mobileWhite:mobileGreen)
        const colors = selected?[Color.primary, Color.lightPrimary]:['white', 'white']
        return(
            <LinearGradient
                colors={colors}
                start={[1,0]}
                end={[0, 1]}
                style={styles.container}>
                <TouchableOpacity onPress={()=>onPress(icon)} style={styles.button}>
                    <Image source={iconImage} style={styles.iconImage}/>
                </TouchableOpacity>
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        width:40,
        height:40,
        borderRadius:20,
        overflow:'hidden'
    },
    button:{
        backgroundColor:'transparent',
        height:40,
        width:40,
        borderRadius:20,
        alignItems:'center',
        justifyContent:'center',
    },
    iconImage:{
        width:20,
        height:20,
        resizeMode:'contain'
    }
})