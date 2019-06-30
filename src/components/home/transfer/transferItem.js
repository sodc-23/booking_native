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
import {transfer_bag, transfer_man} from '@common/image'
import ImagePlaceholder from '@components/general/react-native-image-placeholder'
import Global from '@utils/global'
const {T1, T2} = Global.Translate

export default TransferItem = ({ image, title, location, price, bags, duration, onPress }) => (
    <TouchableOpacity onPress={() => onPress()} style={styles.itemContainer}>
        <ImagePlaceholder source={image} style={styles.image} resizeMode='contain'/>
        <View style={styles.centerItemContainer}>
            <Text numberOfLines={1} style={styles.titleText}>{title}</Text>
            {duration != '0 Hour' && <View style={styles.rowContainer}>
                {/* <Image source={transfer_man} style={styles.icon}/> */}
                <Text style={styles.darkBold}>Duration</Text>
                <Text style={styles.number}>{`${duration}`}</Text>
            </View>}
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
        height: 100,
        resizeMode: 'cover'
    },
    centerItemContainer: {
        flex: 1,
        marginHorizontal: 10,
    },
    desc:{
        fontSize:12,
        color:Color.lightText
    },
    titleText: {
        fontSize: 14,
        color: Color.primary
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5
    },
    icon:{
        width:14,
        height:14,
        resizeMode:'contain'
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
        width:'100%',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    current: {
        fontSize: 14,
        color: Color.orange,
        fontWeight: 'bold'
    }
})