import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity
} from 'react-native'

import Facilities from '@hotel_detail/facilities'
import ReadMore from 'react-native-read-more-text';

import { facilityIcon1 } from '@common/image'
import Color from '@common/color'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as hotelAction from '@store/hotel';
import moment from 'moment'
import Global from "@utils/global";
import Ionicons from '@expo/vector-icons/Ionicons';
const { T1, T2 } = Global.Translate

class PackageOverview extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            facilities: [
                { name: 'Facility1', icon: facilityIcon1 },
                { name: 'Facility1', icon: facilityIcon1 },
                { name: 'Facility1', icon: facilityIcon1 },
                { name: 'Facility1', icon: facilityIcon1 },
                { name: 'Facility1', icon: facilityIcon1 },
                { name: 'Facility1', icon: facilityIcon1 },
                { name: 'Facility1', icon: facilityIcon1 },
                { name: 'Facility1', icon: facilityIcon1 },
            ],
            contactDetail: {
                phone: '+587 12345678',
                location: 'Lorem lpsum Street Bangkok Thailand',
                email: 'fox0905@outlook.com',
                instagram: 'paradiso_hotel',
                twitter: '@paradiso_hotel',
                net: 'paradiso.net'
            },
            description: 'Lorem psusm foordx iesk oifdk iosdk fiomd sid sijfs soijs fiod sif d Lorem psusm foordx iesk oifdk iosdk fiomd sid sijfs soijs fiod sif d Lorem psusm foordx iesk oifdk iosdk fiomd sid sijfs soijs fiod sif d',
            policies: [
                { title: 'Inclusions' },
                { title: 'Exclusions' },
                { title: 'Hotels & Transport' },
                { title: 'Detailed Day Wise Itinerary' },
                { title: 'About Thialand' },
                { title: 'Payment Policy' },
                { title: 'Cancellation Policy' },
                { title: 'terms & Conditions' }
            ]
        }
    }
    render() {
        let { facilities, description, policies } = this.state

        return (
            <View style={styles.container}>
                <ScrollView>
                    {facilities.length > 0 && <Facilities
                        title="INCLUSIONS"
                        facilities={facilities}
                    />}
                    {facilities.length > 0 && <Facilities
                        title="THEMES"
                        facilities={facilities}
                    />}
                    <View style={styles.descContainer}>
                        <Text style={styles.title}>DESCRIPTION</Text>
                        <ReadMore
                            numberOfLines={3}
                            renderTruncatedFooter={onPress => <Text onPress={onPress} style={styles.link}>Read More</Text>}
                            renderRevealedFooter={onPress => <Text onPress={onPress} style={styles.link}>Show Less</Text>}
                        >
                            <Text style={styles.desc}>
                                {description}
                            </Text>
                        </ReadMore>
                    </View>
                    {policies.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => { }} style={styles.policyContainer}>
                            <Text style={styles.policyTitle}>{item.title}</Text>
                            <Ionicons name="ios-arrow-forward" size={20} color={Color.text} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>

            </View>
        )
    }
}

const mapStateToProps = ({ hotel }) => ({ hotel });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...hotelAction }, dispatch)
});

export default PackageOverview = connect(mapStateToProps, mapDispatchToProps)(PackageOverview);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    policyContainer: {
        height: 44,
        alignItems: 'center',
        paddingHorizontal: 15,
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    policyTitle: {
        color: 'black',
        fontSize: 14,
    },
    title: {
        marginVertical: 10,
        textAlign: 'center'
    },
    descContainer:{
        backgroundColor:Color.lightPrimaryBack,
        padding:10
    },
    link:{
        textAlign:'center',
        color:Color.lightPrimary,
        fontSize:12,
        marginVertical:10
    },
    desc: {
        fontSize: 12,
        color: Color.text,
    },
})