import React, { PureComponent } from 'react'
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    View,
    Text,
    Switch
} from 'react-native'
import Color from '@common/color'
import { Ionicons } from '@expo/vector-icons'

export default class MenuItem extends PureComponent {
    render() {
        let { title, onChange, type, value } = this.props
        return (
            <TouchableOpacity disabled={type=='switch'} onPress={()=>onChange()} style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.menuText}>{title}</Text>
                    <View style={styles.menuTypeContainer}>
                        {value!=''&&<Text style={styles.menuValue}>{value}</Text>}
                        {type=='menu'&&<Ionicons name="ios-arrow-forward" size={24} color={Color.lightText}/>}
                    </View>
                    {type=='switch'&&<Switch 
                        trackColor={{true:Color.orange,false:Color.lightBack}} 
                        thumbColor={"white"}
                        value={value} 
                        onValueChange={()=>onChange()} />}
                </View>
                <View style={styles.underline}/>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal:10,
        height:60,
        justifyContent:'center'
    },
    content:{
        flexDirection:'row',
        paddingHorizontal:10,
        justifyContent:'space-between',
        alignItems:'center'
    },
    underline:{
        width:'100%',
        height:0.5,
        backgroundColor:Color.border,
        marginTop:8
    },
    menuText:{
        fontSize:16,
        color: Color.lightText
    },
    menuTypeContainer:{
        flexDirection:'row',
        alignItems:'center'
    },
    menuValue:{
        color: Color.orange,
        fontSize:16,
        marginRight:10
    }
})