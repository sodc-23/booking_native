import React, { PureComponent } from 'react'

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native'

import Modal from 'react-native-modalbox';
import Color from '@common/color'
import Global from "@utils/global";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import UtilService from '@utils/utils';
const {T1, T2} = Global.Translate

const {width:screenWidth} = Dimensions.get('window')

export default PolicyModal = ({ onRef, isLoading, title, description, closeModal }) => (
    <Modal ref={e=>onRef(e)} position="center" style={styles.modal} swipeToClose={false} >
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{title}</Text>
            <TouchableOpacity onPress={()=>closeModal()} style={{padding:5}}>
                <FontAwesome name="times-circle" size={24} color={Color.orange}/>
            </TouchableOpacity>
        </View>
        {isLoading&&<ActivityIndicator style={{flex:1}} color={Color.primary}/>}
        {!isLoading&&<ScrollView >
            <View style={styles.content}>
                <Text style={styles.description}>
                    {(description==''||description==null)?'No Booking Policies found':UtilService.decodeHtmlEntity(description)}
                </Text>
            </View>
        </ScrollView>}
    </Modal>
)

const styles = StyleSheet.create({
    modal: {
        height:300,
        borderRadius:8,
        width: screenWidth-30,
        paddingBottom:10
    },
    headerContainer:{
        backgroundColor:Color.lightBack,
        paddingHorizontal:15,
        alignItems:'center',
        justifyContent:'space-between',
        flexDirection:'row',
        height:40,
        borderTopLeftRadius:8,
        borderTopRightRadius:8,
        borderBottomWidth:0.5,
        borderBottomColor:Color.border
    },
    content:{
        paddingHorizontal:15,
        paddingVertical:20,
    },
    headerText:{
        fontWeight:'bold',
        color:Color.dark,
        fontSize:14
    },
    description:{
        fontSize:12,
        color:Color.darkText,
    }
})