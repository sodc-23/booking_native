import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    Text,
    ScrollView
} from 'react-native'

import HeaderContainer from '@hotel_detail/headerContainer'
import RatingBar from '@hotel_detail/ratingBar'
import CommentItem from '@hotel_detail/commentItem'
import Color from '@common/color'
import { avatar } from '@common/image'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as hotelAction from '@store/hotel';
import moment from 'moment'
import UtilService from '../../../utils/utils';
import Global from "@utils/global";
const {T1, T2} = Global.Translate

class HotelReviewsC extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            ratings: [
                { title: 'Room', desc: 'Logok difd osidf', percent: 70 },
                { title: 'Comfort', desc: 'Logok difd osidf', percent: 30 },
                { title: 'Breakfast', desc: 'Logok difd osidf', percent: 10 },
                { title: 'Location', desc: 'Logok difd osidf', percent: 100 },
                { title: 'Service', desc: 'Logok difd osidf', percent: 50 },
            ],
            comments: [
                { image: avatar, name: 'John Doe', date: '2 hours', desc: 'skdf sdkjow fid fsiojdf sidojf sdiojfs sdij sdoijfogje sijofs sdfio ' },
                { image: avatar, name: 'John Doe', date: '2 hours', desc: 'skdf sdkjow fid fsiojdf sidojf sdiojfs sdij sdoijfogje sijofs sdfio ' },
            ]
        }
    }
    render() {
        let { ratings, comments } = this.state
        return (
            <View style={styles.container}>
                <ScrollView>
                    <HeaderContainer
                        count={Global.currentHotel.ratersCount}
                        mark='Good'
                        average={Global.currentHotel.rating}
                    />
                    <Text style={styles.title}>SUMMARY OF RATINGS</Text>
                    <View style={styles.ratinContainer}>
                        {ratings.map((item, index) =>
                            <RatingBar
                                key={index}
                                {...item}
                            />
                        )}
                    </View>
                    <Text style={styles.title}>COMMENTS</Text>
                    <View style={styles.commentContainter}>
                        {comments.map((item, index) => (
                            <CommentItem
                                key={index}
                                {...item}
                            />
                        ))}
                    </View>
                    <View style={styles.bottom}/>
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = ({ hotel }) => ({ hotel });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...hotelAction }, dispatch)
});

export default HotelReviews = connect(mapStateToProps, mapDispatchToProps)(HotelReviewsC);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    title: {
        textAlign: 'center',
        fontSize: 14,
        color: Color.darkText,
        fontWeight: 'bold',
        marginVertical:15
    },
    ratinContainer: {
        paddingHorizontal: 15,
    },
    commentContainter: {
        paddingHorizontal: 20
    },
    bottom:{
        height:30
    }
})