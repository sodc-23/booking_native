import React, { PureComponent } from 'react'

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Platform
} from 'react-native'

import Modal from 'react-native-modalbox';
import Color from '@common/color'
import Global from "@utils/global";
import AutoHeightWebView from "@components/general/autoHeightWebView";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import UtilService from '@utils/utils';
const {T1, T2} = Global.Translate

const {width:screenWidth} = Dimensions.get('window')

export default PolicyModal2 = ({ onRef, isLoading, title, policies, closeModal }) => (
    <Modal ref={e=>onRef(e)} position="center" style={styles.modal} swipeToClose={false} >
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{title||' '}</Text>
            <TouchableOpacity onPress={()=>closeModal()} style={{padding:5}}>
                <FontAwesome name="times-circle" size={24} color={Color.orange}/>
            </TouchableOpacity>
        </View>
        {isLoading&&<ActivityIndicator style={{flex:1}} color={Color.primary}/>}
        {!isLoading&&<ScrollView >
            <View style={styles.content}>
                {policies.length>0?policies.map((item, index)=>(
                    <View key={index}>
                        <Text style={styles.itemType}>{item.type||' '}</Text>
                        <AutoHeightWebView  
                            style={styles.itemDescription}
                            scalesPageToFit={Platform.OS === 'android'}
                            source={{html:item.description}}
                        />
                    </View>
                )):<Text>No Policy(s) found.</Text>}
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
        paddingVertical:10,
    },
    headerText:{
        fontWeight:'bold',
        color:Color.orange,
        fontSize:14
    },
    itemDescription:{
        // fontSize:12,
        // color:Color.darkText,
        marginTop: 8
    },
    itemType:{
        fontSize:12,
        color:'black',
        fontWeight:'bold',
        marginTop:8
    }
})