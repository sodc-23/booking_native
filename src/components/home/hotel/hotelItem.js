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
import { placeholderImage, promotion, noImage, noImage2 } from '@common/image'
import ImagePlaceholder from '@components/general/react-native-image-placeholder'
const { T1, T2 } = Global.Translate

export default HotelItem = ({ image, title, rating, review, location, before, current, desc, hasSpecialDeal, specialDealDescription = '', onPress, ratingInfo, language:{T3} }) => (
    <TouchableOpacity onPress={() => onPress()} style={styles.itemContainer}>
        <ImagePlaceholder
            source={image||noImage2}
            style={styles.image}
            noImage={noImage2}
        />
        {/* <Image source={image} style={styles.image}/> */}
        <View style={styles.centerItemContainer}>
            <View style={styles.titleContainer}>
                <Text numberOfLines={1} style={styles.titleText}>{title}</Text>
                {hasSpecialDeal && (
                    specialDealDescription == '' ?
                        <Image source={promotion} style={styles.promotionIcon} /> :
                        <Text numberOfLines={1} style={styles.promotionText}>{specialDealDescription}</Text>
                )}
            </View>


            <StarRating
                disabled={true}
                maxStars={5}
                rating={rating}
                starSize={10}
                containerStyle={{ width: 50, marginTop: 5 }}
                fullStarColor={Color.orange}
            />
            {/* <View style={styles.flexRow}>
                <View style={styles.scoreContainer} >
                    <Text style={styles.scoreText}>{review}</Text>
                </View>
                <Text style={styles.markText}>{rating > 8 ? 'Excellent' : (rating > 6 ? 'Good' : 'Normal')}</Text>
            </View> */}
            <View style={styles.locationContainer} >
                <Ionicons name="ios-pin" size={12} color={Color.lightText} />
                <Text style={styles.locationText}>{location}</Text>
            </View>
            {ratingInfo!=null&&ratingInfo.length>0&&<View style={[styles.locationContainer,{alignItems:'flex-end'}]}>
                <Image source={{uri:ratingInfo[0].image.url}} style={{width:100, height:20, resizeMode:'contain'}}/>
                <Text style={styles.ratingText}>{ratingInfo[0].rating+' Of 5'}</Text>
                <Text style={styles.ratersCount}>{ratingInfo[0].ratersCount} {T3('Reviews')}</Text>
            </View>}
            <View style={styles.rightItemContainer}>
                <View style={styles.rowLayout}>
                    {before > 0 && <Text style={styles.beforeTextPrefix} >
                        Was
                    </Text>}
                    {before > 0 && <Text style={styles.beforeText} >
                        {before}
                    </Text>}
                    <Text style={styles.current}> {current}</Text>
                </View>
                <Text style={styles.descText} >{desc}</Text>
            </View>
        </View>

    </TouchableOpacity >
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
        resizeMode: 'cover',
    },
    centerItemContainer: {
        flex: 1,
        marginHorizontal: 10,
    },
    titleText: {
        fontSize: 14,
        color: Color.primary,
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
        marginTop: 5
    },
    rowLayout: {
        flexDirection: 'row',
    },
    locationText: {
        color: Color.lightText,
        fontSize: 10,
        marginLeft: 5
    },
    rightItemContainer: {
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginTop:3
    },
    beforeTextPrefix: {
        paddingTop: 2,
        fontSize: 10,
        color: Color.lightText,
        fontWeight: 'bold',
        paddingRight: 4,
    },
    beforeText: {
        paddingTop: 2,
        fontSize: 10,
        color: Color.lightText,
        textDecorationLine: 'line-through',
        fontWeight: 'bold'
    },
    current: {
        fontSize: 12,
        color: Color.orange,
        fontWeight: 'bold'
    },
    descText: {
        color: Color.primary,
        fontSize: 10,
    },
    promotionIcon: {
        height: 14,
        width: 14,
        resizeMode: 'contain',
        marginLeft: 8
    },
    promotionText: {
        color: Color.orange,
        fontSize: 14
    },
    titleContainer:{
        flexDirection:'row',
        alignItems:'center'
    },
    ratingText:{
        fontSize:11,
        color:Color.orange,
        marginLeft:10
    },
    ratersCount:{
        fontSize:11,
        color:Color.text,
        marginLeft:10
    }
})