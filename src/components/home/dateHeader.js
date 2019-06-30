import React, {PureComponent} from 'react'
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    ScrollView,
    View
} from 'react-native'
import Color from '@common/color'
import Ionicons from '@expo/vector-icons/Ionicons';
import moment from 'moment'
import Global from "@utils/global";
// const {T1, T2} = Global.Translate
import Marquee from '@components/general/react-native-text-ticker'

export default class DateView extends PureComponent{
    render(){
        let {fromDate, toDate, language:{T2}} = this.props
        return(
            <View onPress={()=>onPress()} style={styles.container}>
                <View style={styles.subContainer}>
                    <Marquee style={styles.title}>{T2('Check-in')}</Marquee>
                    <View style={styles.dateContainer}>
                        <Text style={styles.dateText}>{moment(fromDate).format('DD')}</Text>
                        <View>
                            <Text style={[styles.normal,{color:'white'}]}>{moment(fromDate).format('ddd')}</Text>
                            <Text style={styles.normal}>{moment(fromDate).format('MMM')}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.spacer}>
                    <Ionicons name="ios-arrow-forward" size={26} color={Color.lightText}/>
                </View>

                <View style={styles.subContainer}>
                    <Marquee style={styles.title}>{T2('Check-out')}</Marquee>
                    <View style={styles.dateContainer}>
                        <Text style={styles.dateText}>{moment(toDate).format('DD')}</Text>
                        <View>
                            <Text style={[styles.normal,{color:'white'}]}>{moment(toDate).format('ddd')}</Text>
                            <Text style={styles.normal}>{moment(toDate).format('MMM')}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        width:'100%',
        flexDirection:'row',
        paddingHorizontal:50,
        paddingVertical:20,
        backgroundColor:Color.primary,
    },
    subContainer:{
        flex:2,
    },
    spacer:{
        flex:2,
        justifyContent:'flex-end',
        alignItems:'center'
    },
    title:{
        fontSize:15,
        color:Color.lightText,
    },
    normal:{
        fontSize:12,
        color:Color.lightText
    },
    dateText:{
        fontSize:30,
        color:'white',
        marginRight:10
    },
    dateContainer:{
        flexDirection:'row',
        marginTop:5
    }
})