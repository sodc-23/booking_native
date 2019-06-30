import React, { PureComponent } from 'react'

import{
    View,
    Text,
    StyleSheet
} from 'react-native'

import Color from '@common/color'
import Global from "@utils/global";

export default class Polices extends PureComponent {
    constructor(props) {
        super(props)
    }
    render() {
        let {policies, language:{T1, T2}} = this.props
        return (
            <View style={styles.container}>
                {policies.map((item, index)=>(
                    <View key={index} style={[styles.itemContainer, {borderTopWidth:index!=0?0.5:0}]}>
                        <Text style={styles.title}>{T2((item.title=='CreditCard'?'Payment Policy':item.title).toLowerCase()).toUpperCase()}</Text>
                        {
                            item.descriptions.map((desc)=>(
                                <View style={styles.descLine}>  
                                    <View style={styles.bullet}>
                                        <Text >{'\u2022 '}</Text>
                                    </View>
                                    <View style={styles.desc}>
                                        <Text style={styles.descText}>{desc}</Text>
                                    </View>
                                </View>
                            ))
                        }
                    </View>
                ))}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        paddingHorizontal:15
    },
    itemContainer:{
        paddingVertical:20,
        borderTopColor:Color.border
    }, 
    title:{
        fontSize:13,
        color:Color.darkText,
        fontWeight:'bold'
    },
    desc:{
        flex:1
    },
    descText: {
        fontSize:12,
        color:Color.text,
    },
    link:{
        fontSize:13,
        color:Color.primary,
        marginTop:10
    },
    descLine:{
        marginTop:10,
        flex:1,
        flexDirection:'row',
        alignItems: 'flex-start',
        flexWrap: 'wrap'
    },
    bullet: {
        width:10
    }
})