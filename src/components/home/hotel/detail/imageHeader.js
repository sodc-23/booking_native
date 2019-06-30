import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    ImageBackground,
    Text,
    TouchableOpacity
} from 'react-native'

import { LinearGradient } from 'expo'
import { Actions } from 'react-native-router-flux';
import StarRating from 'react-native-star-rating'
import Color from '@common/color'
import Global from "@utils/global";
import Marquee from '@components/general/react-native-text-ticker'
import { connect } from 'react-redux';


class ImageHeader extends PureComponent {
    render() {
        let { images, minPrice, hotelName, isAmountPerNight, rating, language:{T1, T2} } = this.props
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.ImageList({images, defaultTitle:hotelName})}>
                <ImageBackground source={images[0]?images[0].image:null} style={styles.container}>
                    <LinearGradient
                        colors={['rgba(0, 0, 0, 1)', 'rgba(0,0,0,0)']}
                        start={[0, 1]}
                        end={[0, 0.4]}
                        style={styles.gradient}
                    />
                    {rating != null && <View style={styles.infoContainer}>
                        <Text style={styles.minPrice}>
                            {T2('from').toProperCase()} <Text style={styles.value}>{minPrice||' '}</Text> {isAmountPerNight ? '/ Night' : ' '}
                        </Text>
                        <Marquee style={styles.hotelName}>
                            {hotelName||' '}
                        </Marquee>
                    </View>}
                    {rating == null && <View style={styles.infoContainerFull}>
                        {minPrice != null && <Text style={styles.minPrice}>
                            {T2('from').toProperCase()} <Text style={styles.value}>{minPrice||' '}</Text> {isAmountPerNight ? '/ '+T2('night').toProperCase() : ' '}
                        </Text>}
                        <Marquee style={styles.hotelName}>
                            {hotelName||' '}
                        </Marquee>
                    </View>}
                    <View style={styles.topContainer}>
                        <Text style={styles.imageCount}>{images.length} {T2('images').toProperCase()}</Text>
                    </View>
                    {rating != null && <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={rating}
                        starSize={12}
                        containerStyle={styles.star}
                        fullStarColor={'yellow'}
                    />}
                </ImageBackground>
            </TouchableOpacity>
        )
    }
}


const mapStateToProps = ({ language }) => ({ language });

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ImageHeader);

const styles = StyleSheet.create({
    container: {
        height: 180,
        width: '100%',
        resizeMode: 'cover'
    },
    gradient: {
        flex: 1
    },
    infoContainer: {
        position: 'absolute',
        left: 15,
        bottom: 15,
        width:'60%'
    },
    infoContainerFull: {
        position: 'absolute',
        paddingHorizontal : 15,
        bottom: 15,
        width:'100%'
    },
    hotelName: {
        color: 'white',
        fontSize: 16,
        marginTop: 5
    },
    minPrice: {
        color: 'white',
        fontSize: 10,
    },
    value: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    topContainer: {
        position: 'absolute',
        right: 15,
        top: 15,
        paddingHorizontal: 15,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    imageCount: {
        color: 'white',
        fontSize: 12
    },
    star:{ 
        width: 75, 
        position:'absolute', 
        right:15, 
        bottom:20 
    }
})