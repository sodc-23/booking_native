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
const {T1, T2} = Global.Translate
import Marquee from '@components/general/react-native-text-ticker'

import {connect} from 'react-redux'

class DateView extends PureComponent{
    constructor(props){
        super(props)
        this.state={
        }
    }
    render(){
        let {fromDate, toDate, onPress, fromTitle, toTitle, language} = this.props
        let {T1, T2, T3, T4} = language
        return(
            <TouchableOpacity onPress={()=>onPress()} style={styles.container}>
                <View style={styles.subContainer}>
                    <Marquee style={styles.title}>{fromTitle||T2('Check-in')}</Marquee>
                    <View style={styles.dateContainer}>
                        <Text style={styles.dateText}>{moment(fromDate).format('DD')}</Text>
                        <View>
                            <Text style={styles.normal}>{T1(moment(fromDate).format('ddd').toLowerCase()).toProperCase()}</Text>
                            <Text style={styles.normal}>{T1(moment(fromDate).format('MMM').toLowerCase()).toProperCase()}</Text>
                        </View>
                    </View>
                </View>

                {toDate!=null && <View style={styles.spacer}>
                    <Ionicons name="ios-arrow-forward" size={30} color={Color.text}/>
                </View>}

                {toDate!=null&&<View style={styles.subContainer}>
                    <Marquee style={styles.title}>{toTitle||T2('Check-out')}</Marquee>
                    <View style={styles.dateContainer}>
                        <Text style={styles.dateText}>{moment(toDate).format('DD')}</Text>
                        <View>
                            <Text style={styles.normal}>{T1(moment(toDate).format('ddd').toLowerCase()).toProperCase()}</Text>
                            <Text style={styles.normal}>{T1(moment(toDate).format('MMM').toLowerCase()).toProperCase()}</Text>
                        </View>
                    </View>
                </View>}
            </TouchableOpacity>
        )
    }
}

const mapState=({language})=>({language})
const dispatch=(dispatch)=>({})
export default connect(mapState, dispatch)(DateView)

const styles = StyleSheet.create({
    container:{
        width:'100%',
        flexDirection:'row',
        paddingHorizontal:50,
        paddingVertical:20,
        backgroundColor:'white',
        marginTop:5
    },
    subContainer:{
        flex:2,
        alignItems:'center'
    },
    spacer:{
        flex:1,
        justifyContent:'flex-end',
        alignItems:'center'
    },
    title:{
        fontSize:14,
        color:Color.lightText,
    },
    normal:{
        fontSize:12,
        color:Color.lightText
    },
    dateText:{
        fontSize:24,
        color:Color.orange,
        marginRight:10
    },
    dateContainer:{
        flexDirection:'row',
        marginTop:5
    }
})