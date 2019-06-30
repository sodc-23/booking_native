import React from 'react'

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    TouchableOpacity,
    Image
} from 'react-native'

import Color from '@common/color'
const {width:screenWidth} = Dimensions.get('window')
import { facilityIcon1 } from '@common/image'
import Global from "@utils/global";
import mapping from '@common/iconMapping'
const {T1, T2} = Global.Translate

export default Facilities = ({facilities, title, noTitle, language:{T1, T2} }) => (
    <View style={styles.container}>
        {!noTitle&&<Text style={styles.title}>{T2((title||'FACILITY').toLowerCase()).toUpperCase()}</Text>}
        <FlatList
            numColumns={4}
            style={styles.flatlist}
            data={facilities}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
                const svgIcon = mapping[item.name]?mapping[item.name]:require('@images/svg/default.png')
                return (
                    <View style={styles.itemContainer}>
                        <TouchableOpacity style={styles.iconContainer}>
                            <Image source={svgIcon} style={styles.icon}/>
                        </TouchableOpacity>
                        <Text style={styles.name}>{item.name}</Text>
                    </View>
                )
            }}
        />
    </View>
)

const styles = StyleSheet.create({
    container: {
        paddingVertical:15,
        borderBottomColor:Color.border,
        borderBottomWidth:0.5
    },
    title:{
        textAlign:'center',
        fontSize:14,
        color:Color.darkText,
        fontWeight:'bold'
    },
    flatlist:{
        
    },
    itemContainer:{
        width:screenWidth/4,
        alignItems:'center',
        marginTop:20
    },
    iconContainer:{
        width:40,
        height:40,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
        backgroundColor:Color.lightBack,
        borderWidth:0.5,
        borderColor: Color.orange,
        
    },
    name:{
        fontSize:10,
        color:Color.orange,
        marginTop:5,
        fontWeight:'bold',
        textAlign:'center'
    },
    icon:{
        width:24,
        height:24,
        resizeMode:'contain'
    }
})