import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    Text,
    ScrollView
} from 'react-native'

import Facilities from '@hotel_detail/facilities'
import ContactDetail from '@hotel_detail/contactDetail'
import Descriptions from '@hotel_detail/descriptions'
import Policies from '@hotel_detail/policies'


import { facilityIcon1 } from '@common/image'
import Color from '@common/color'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as hotelAction from '@store/hotel';
import moment from 'moment'
import UtilService from '../../../utils/utils';
import Global from "@utils/global";
const { T1, T2 } = Global.Translate

class HotelOverviewC extends PureComponent {
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
            descriptions: [
                { title: 'DESCRIPTION', description: 'Lorem psusm foordx iesk oifdk iosdk fiomd sid sijfs soijs fiod sif d', readMore: () => { alert('okay') } },
                { title: 'PAYMENT POLICY', description: 'Lorem psusm foordx iesk oifdk iosdk fiomd sid sijfs soijs fiod sif d' },
                { title: 'CANCELLATION POLICY', description: 'Lorem psusm foordx iesk oifdk iosdk fiomd sid sijfs soijs fiod sif d' },
            ],

        }
    }
    render() {
        let { hotel } = this.props.hotel
        hotel = hotel || {}
        let facilities = []
        let descriptions = []
        let policies = []
        let contactInformation = hotel.contactInformation
        let showContact = false
        if (contactInformation) {
            //check if contact information includes valid value
            showContact = (Object.keys(contactInformation).filter(v => contactInformation[v] != '').length > 0)
        }
        if (hotel.amenities) {
            facilities = hotel.amenities
        }
        if (hotel.description) {
            descriptions.push({
                title: 'Description',
                description: UtilService.decodeHtmlEntity(hotel.description)
            })
        }
        if (hotel.policies) {
            let rawPolicies = hotel.policies
            let rawTypes = rawPolicies.map(o => o.type)
            let groupNames = rawTypes.filter(function (item, pos) {
                return rawTypes.indexOf(item) == pos;
            })
            policies = groupNames.map((type) => {
                return {
                    title: type,
                    descriptions: rawPolicies.filter((o) => o.type == type).map(o => o.description)
                }
            })
        }
        let {language} = this.props

        return (
            <View style={styles.container}>
                <ScrollView>
                    {facilities.length > 0 && <Facilities
                        language={language}
                        facilities={facilities}
                    />}
                    {showContact && <ContactDetail
                        language={language}
                        {...contactInformation}
                    />}
                    <Descriptions
                        language={language}
                        descriptions={descriptions}
                    />
                    {policies.length > 0 && <Policies language={language} policies={policies}></Policies>}
                </ScrollView>

            </View>
        )
    }
}

const mapStateToProps = ({ hotel, language }) => ({ hotel, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...hotelAction }, dispatch)
});

export default HotelOverview = connect(mapStateToProps, mapDispatchToProps)(HotelOverviewC);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

})