import React from 'react'

import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image
} from 'react-native'
import Color from '@common/color';
import Ionicons from '@expo/vector-icons/Ionicons';
import {transfer_bag, transfer_man, noImage2, doors_icon, transmission_icon, ac_icon, primaryInfo} from '@common/image'
import ImagePlaceholder from '@components/general/react-native-image-placeholder'
import Global from '@utils/global'
const {T1, T2} = Global.Translate

export default TransferItem = ({ image, vendorImage, title, category, price, strikePrice, baggages, passengers, transmission, doors, ac, onPress, onPressFarePrice }) => (
    <TouchableOpacity onPress={() => onPress()} style={styles.itemContainer}>
        <Image source={image?{uri:image}:noImage2} style={styles.image}/>
        {vendorImage!=null&&<Image source={{uri:vendorImage}} style={styles.vendorImage}/>}
        <View style={styles.centerItemContainer}>
            <Text numberOfLines={1} style={styles.titleText}>{title}</Text>
            <Text numberOfLines={1} style={styles.desc}>{category}</Text>
            <View style={styles.rowContainer2}>
                <View style={styles.leftContainer}>
                    <View style={styles.rowContainer}>
                        <Image source={transfer_man} style={styles.icon}/>
                        <Text style={styles.number}>{passengers}</Text>
                        <Text style={styles.darkBold}>Passengers</Text>
                    </View>
                    <View style={styles.rowContainer}>
                        <Image source={transfer_bag} style={styles.icon}/>
                        <Text style={styles.number}>{baggages}</Text>
                        <Text style={styles.darkBold}>Bags</Text>
                    </View>
                    <View style={styles.rowContainer}>
                        <Image source={doors_icon} style={styles.icon_small}/>
                        <Text style={styles.number}>{doors}</Text>
                        <Text style={styles.darkBold}>Doors</Text>
                    </View>
                </View>
                <View style={styles.leftContainer}>
                    <View style={styles.rowContainer}>
                        <Image source={ac_icon} style={styles.icon_small}/>
                        <Text style={styles.number}>{ac}</Text>
                        <Text style={styles.darkBold}>AC</Text>
                    </View>
                    <View style={styles.rowContainer}>
                        <Image source={transmission_icon} style={styles.icon_small}/>
                        <Text style={styles.number}>{transmission}</Text>
                        <Text style={styles.darkBold}>Transmission</Text>
                    </View>
                    <TouchableOpacity style={styles.rowContainer} onPress={()=>{
                       onPressFarePrice()
                    }}>
                        <Ionicons name="ios-information-circle-outline" size={14} color={Color.primary}/>
                        <Text style={styles.number}>Rental Conditions</Text>
                    </TouchableOpacity>
                </View>
            </View>    
            <View style={styles.rightItemContainer}>
                <View style={styles.rowLayout}>
                    <Text style={styles.current}> {price}</Text>
                </View>
            </View>
        </View>

    </TouchableOpacity>
)

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: Color.comment,
        paddingVertical: 10,
    },
    image: {
        width: 80,
        height: 114,
        resizeMode: 'cover'
    },
    vendorImage: {
        width: 40,
        height: 25,
        resizeMode: 'cover',
        position:'absolute',
        bottom:10,
        left:0
    },
    centerItemContainer: {
        flex: 1,
        marginHorizontal: 10,
    },
    desc:{
        fontSize:12,
        color:Color.lightText,
        marginTop:3,
    },
    titleText: {
        fontSize: 14,
        color: Color.primary
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4
    },
    rowContainer2: {
        flexDirection: 'row',
        marginTop: 4,
    },
    icon:{
        width:14,
        height:14,
        resizeMode:'contain'
    },
    icon_small:{
        width:12,
        height:12,
        resizeMode:'contain',
        marginHorizontal:1,
        marginVertical:1,
    },
    number:{
        color:Color.orange,
        fontWeight:'bold',
        fontSize:10,
        marginLeft:5
    },
    darkBold:{
        fontSize:10,
        color:Color.text,
        fontWeight:'bold',
        marginLeft:5
    },
    rightItemContainer: {
        marginTop: 3,
        width:'100%',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    current: {
        fontSize: 14,
        color: Color.orange,
        fontWeight: 'bold'
    },
    leftContainer:{
        flex:1,
    },
    rightContainer:{
        flex:1
    },
})