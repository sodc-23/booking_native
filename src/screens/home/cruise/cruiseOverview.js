import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    Text,
    ScrollView
} from 'react-native'

import Facilities from '@components/home/cruise/facilities'
import ContactDetail from '@components/home/cruise/contactDetail'
import Descriptions from '@components/home/cruise/descriptions'
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

class CruiseOverviewC extends PureComponent {
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
        let {language} = this.props

        return (
            <View style={styles.container}>
                <ScrollView>
                    <Facilities
                        language={language}
                        facilities={this.state.facilities}
                    />
                    <ContactDetail
                        language={language}
                        {...this.state.contactDetail}
                    />
                    <Descriptions
                        language={language}
                        descriptions={this.state.descriptions}
                    />
                    {/* {policies.length > 0 && <Policies language={language} policies={policies}></Policies>} */}
                </ScrollView>

            </View>
        )
    }
}

const mapStateToProps = ({ language }) => ({ language });

const mapDispatchToProps = (dispatch) => ({
});

export default CruiseOverview = connect(mapStateToProps, mapDispatchToProps)(CruiseOverviewC);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

})