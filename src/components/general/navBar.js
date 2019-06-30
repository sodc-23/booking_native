import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Actions } from 'react-native-router-flux';
import Color from '@common/color'
import * as Const from '@common/const'
import Device from '@common/device'

import Marquee from '@components/general/react-native-text-ticker'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class NavBar extends React.Component {
    constructor(props){
        super(props)
    }

  render() {
      let {onRight, rightTitle, title, description, scenes, goBack, notifications}  = this.props
      let {T1, T2} = this.props.language
    return (
        <View style={styles.headerContainer}>
            <View style={styles.titleContainer}>
                <Marquee style={styles.title}>{T2((title||'').toLowerCase()).toProperCase()}</Marquee>
                {description&&description!='' && <Marquee style={styles.description}>{description}</Marquee>}
            </View>
            {(goBack||scenes.length>1)&&<TouchableOpacity onPress={()=>goBack?goBack():Actions.pop()} style={styles.left}>
                <Ionicons name="ios-arrow-back" size={30} color='white'/>
            </TouchableOpacity>}
            {onRight&&rightTitle!='' && <TouchableOpacity onPress={()=>onRight()} style={styles.right}>
                <Text style={styles.rightText}>{rightTitle}</Text>
            </TouchableOpacity>}
            {onRight&&notifications!=null&&<TouchableOpacity style={styles.right} onPress={()=>onRight()}>
                <FontAwesome name="bell-o" size={24} color={'white'}/>
                <View style={styles.badgeContainer}>
                    <Text style={styles.badgeNumber}>{notifications}</Text>
                </View>
            </TouchableOpacity>}
        </View>
    )
  }
}

const mapStateToProps = ({ language }) => ({ language });

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);

const styles=StyleSheet.create({
    headerContainer:{
        width:'100%', 
        height: Const.navBarHeight + Device.ToolbarHeight, 
        paddingTop: Device.ToolbarHeight,
        flexDirection:'row', 
        alignItems:'center', 
        backgroundColor:Color.primary,
        paddingHorizontal: 20
    },
    
    title:{
        fontSize:16,
        // fontWeight:'bold',
        color:'white',
    },

    description:{
        marginTop:5,
        fontSize:12,
        color:'white',
    },

    titleContainer:{
        flex:1,
        alignItems:'center',
        marginHorizontal:40
    },

    left:{
        paddingVertical:8,
        paddingHorizontal:20,
        position:'absolute',
        bottom:0,
    },
    right:{
        position: 'absolute',
        paddingVertical:8,
        paddingHorizontal:20,
        bottom:8,
        right:0
    },
    rightText:{
        fontSize:12,
        color:'white',
        // fontWeight:'bold'
    },
    badgeContainer:{
        width:14,
        height:14,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:8,
        backgroundColor:'red',
        position:'absolute',
        right:15,
        top:8,
    },
    badgeNumber:{
        fontSize:10,
        color:'white'
    }
})