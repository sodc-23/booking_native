import React from 'react'

import{
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    Image
} from 'react-native'
import Color from '@common/color';
import {filterIcon, sortIcon, mapIcon, calendarIcon} from '@common/image'
import Global from "@utils/global";
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

const TabItem=({title, image, onPress, disabled})=>(
    <TouchableOpacity disabled={disabled} onPress={()=>onPress()} style={styles.tabItemContainer}>
        <Image source={image} style={styles.image}/>
        <Text style={styles.tabItemText}>{title}</Text>
    </TouchableOpacity>
)

const FilterBar=({onPress, type, disabled, language:{T1, T2}})=>(
    <View style={styles.container}>
        <TabItem
            title={T2("sort by").toUpperCase()}
            image={sortIcon}
            onPress={()=>onPress(0)}
            disabled={disabled}
        />
        <View style={styles.spacer}/>
        <TabItem
            title={T2("filter").toUpperCase()}
            image={filterIcon}
            onPress={()=>onPress(1)}
            disabled={disabled}
        />
        {type!='NONE'&&<View style={styles.spacer}/>}
        {type=='CHANGEDATE'&&<TabItem
            title={T2("change date").toUpperCase()}
            image={calendarIcon}
            onPress={()=>{
                Actions.pop()
            }}
            disabled={disabled}
        />}
        {(type=='LIST'||type=='MAP')&&<TabItem
            title={T2(type=='LIST'?"map":'list').toUpperCase()}
            image={type=='LIST'?mapIcon:mapIcon}
            onPress={()=>onPress(2)}
            disabled={disabled}
        />}
    </View>
)

const mapStateToProps = ({language }) => ({language });

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(FilterBar);

const styles=StyleSheet.create({
    container:{
        height:50,
        flexDirection:'row',
        width:'100%',
        backgroundColor:Color.lightBack,
        paddingVertical:8,
        borderBottomWidth:0.5,
        borderBottomColor:Color.border
    },
    tabItemContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row'
    },
    tabItemText:{
        fontSize:12,
        color: Color.text,
        marginLeft:5
    },
    image:{
        width:12,
        height:12,
        resizeMode:'contain'
    },
    spacer:{
        height:'100%',
        width:1,
        backgroundColor:Color.border
    }
})