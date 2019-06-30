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
import StarRating from 'react-native-star-rating';
import Global from "@utils/global";
import ImagePlaceholder from '@components/general/react-native-image-placeholder'
const {T1, T2} = Global.Translate

export default PackageItem = ({ image, title, rating, duration, location, before, current, desc, onPress, language:{T1, T2} }) => (
    <TouchableOpacity onPress={() => onPress()} style={styles.itemContainer}>
        <ImagePlaceholder duration={1000} source={image} style={styles.image}/>
        <View style={styles.centerItemContainer}>
            <Text numberOfLines={1} style={styles.titleText}>{title}</Text>
            {duration != null && <View style={styles.locationContainer} >
                <Ionicons name="ios-pin" size={12} color={Color.lightText} />
                <Text style={styles.locationText}>&nbsp;&nbsp;{location}</Text>
            </View>}
            {rating > 0 && <StarRating
                disabled={true}
                maxStars={5}
                rating={rating}
                starSize={10}
                containerStyle={{ width: 50, marginTop: 5 }}
                fullStarColor={Color.orange}
            />}
            {duration != null && <View style={styles.locationContainer} >
                {/* <Ionicons name="ios-pin" size={12} color={Color.lightText} /> */}
                <Text style={styles.locationText}>{T1('duration').toProperCase()}: {duration}</Text>
            </View>}
            <View style={styles.rightItemContainer}>
                <View style={styles.rowLayout}>
                    <Text style={styles.priceLabel}> {T2('total price').toProperCase()}</Text>
                </View>
                <View style={styles.rowLayout}>
                    {before!=null&&before!=0&&<Text style={styles.beforeTextPrefix} >
                        {T1('was').toProperCase()}
                    </Text>}
                    {before!=null&&before!=0&&<Text style={styles.beforeText} >
                        {before}
                    </Text>}
                    <Text style={styles.current}> {current}</Text>
                </View>
                <Text style={styles.descText} >{desc}</Text>
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
    titleText: {
        fontSize: 14,
        color: Color.primary
    },
    orangeText: {
        fontSize: 10,
        color: Color.orange
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5
    },
    scoreContainer: {
        padding: 2,
        borderRadius: 2,
        backgroundColor: Color.lightPrimary
    },
    scoreText: {
        fontSize: 10,
        color: 'white'
    },
    markText: {
        marginLeft: 8,
        color: Color.lightPrimary,
        fontSize: 12
    },
    locationContainer: {
        flexDirection: 'row',
        marginTop: 4
    },
    rowLayout: {
        flexDirection: 'row',
    },
    locationText: {
        color: Color.lightText,
        fontSize: 10
    },
    rightItemContainer: {
        width:'100%',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    beforeTextPrefix: {
        paddingTop:2,
        fontSize: 10,
        color: Color.lightText,
        fontWeight: 'bold',
        paddingRight:4,
    },
    beforeText: {
        paddingTop:2,
        fontSize: 10,
        color: Color.lightText,
        textDecorationLine: 'line-through',
        fontWeight: 'bold'
    },
    priceLabel: {
        fontSize: 8,
        color: Color.lightText,
    },
    current: {
        fontSize: 14,
        color: Color.orange,
        fontWeight: 'bold'
    },
    descText: {
        color: Color.primary,
        fontSize: 10,
    }
})