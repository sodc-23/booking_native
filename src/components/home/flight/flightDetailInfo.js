import React from 'react'

import {
    View,
    Image,
    Text,
    StyleSheet,
    ScrollView,
    FlatList,
    Platform
} from 'react-native'

import Color from '@common/color'
import { facility_primary1 } from '@common/image'
import UtilService from '@utils/utils';
import moment from 'moment';
import { Feather } from '@expo/vector-icons';

export default class FlightDetailInfo extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            facilities: [
                { icon: facility_primary1, name: 'Bagage' },
                { icon: facility_primary1, name: 'Wifi' },
                { icon: facility_primary1, name: 'Lunch' },
                { icon: facility_primary1, name: 'Disability' },
            ],
            ways: [
                { fromTime: '6:25 PM', toTime: '8:15 PM', duration: '1h 50m', desc1: 'Kuala Lumuar to Roma', desc2: 'Egypt Air 2552 operated by EgyptAir', desc3: 'Economy/Coach', desc4: 'DE HAVILAND DHC-8 DASH 8-400 DASH 8Q' },
                { fromTime: '6:25 PM', toTime: '8:15 PM', duration: '1h 50m', desc1: 'Kuala Lumuar to Roma', desc2: 'Egypt Air 2552 operated by EgyptAir', desc3: 'Economy/Coach', desc4: 'DE HAVILAND DHC-8 DASH 8-400 DASH 8Q' },
                { fromTime: '6:25 PM', toTime: '8:15 PM', duration: '1h 50m', desc1: 'Kuala Lumuar to Roma', desc2: 'Egypt Air 2552 operated by EgyptAir', desc3: 'Economy/Coach', desc4: 'DE HAVILAND DHC-8 DASH 8-400 DASH 8Q' }
            ],
            policies: [
                { title: 'RULE APPLICATION AND OTHER CONDISTIONS', value: 'NOTE-THE FOLLWING TEXT IS INFORMATIONAL AND NOT VALIDATED FOR AUTOPRICEING. JET AIRPWAYS BRAND- ECONOMY DEAL.APPLICATION CALSS OF SERVICE THESE FARES APL:LY FOR ECONOMY CALSS SERVCE. TYPES OF TRANSPORTATION THIS RULE GOVERNS ONE ' },
                { title: 'RULE APPLICATION AND OTHER CONDISTIONS', value: 'NOTE-THE FOLLWING TEXT IS INFORMATIONAL AND NOT VALIDATED FOR AUTOPRICEING. JET AIRPWAYS BRAND- ECONOMY DEAL.APPLICATION CALSS OF SERVICE THESE FARES APL:LY FOR ECONOMY CALSS SERVCE. TYPES OF TRANSPORTATION THIS RULE GOVERNS ONE ' },
                { title: 'RULE APPLICATION AND OTHER CONDISTIONS', value: 'NOTE-THE FOLLWING TEXT IS INFORMATIONAL AND NOT VALIDATED FOR AUTOPRICEING. JET AIRPWAYS BRAND- ECONOMY DEAL.APPLICATION CALSS OF SERVICE THESE FARES APL:LY FOR ECONOMY CALSS SERVCE. TYPES OF TRANSPORTATION THIS RULE GOVERNS ONE ' },
                { title: 'RULE APPLICATION AND OTHER CONDISTIONS', value: 'NOTE-THE FOLLWING TEXT IS INFORMATIONAL AND NOT VALIDATED FOR AUTOPRICEING. JET AIRPWAYS BRAND- ECONOMY DEAL.APPLICATION CALSS OF SERVICE THESE FARES APL:LY FOR ECONOMY CALSS SERVCE. TYPES OF TRANSPORTATION THIS RULE GOVERNS ONE ' },
            ],
            info: 'Lorem ipsum dolor sit amet, onsecteur adipiscing elit. Suspendisse sed uma in justo euismod condimentium. Fusce Placerate enim et odio molestie saitts.',
            title: 'Kuala Lumpur, Malaysia(KLIA) - Rome (RMA) - Bangung, Indonesia (LRM), Duration  3h 51m, 1 Stop:'
        }
    }

    componentDidMount() {
        // this.flashInterval = setInterval(() => {
        //     if(this.refs.ruleScroll) {
        //         this.refs.ruleScroll.flashScrollIndicators()
        //     }
        // }, 3000)
    }
    componentWillUnmount() {
        clearInterval(this.flashInterval)
    }

    render() {
        let { facilities, ways, info, policies } = this.state
        let { item = [{}], properties = {}, type, fareBreakups, fareRules } = this.props
        let { dateInfo = {}, images = [], config, stops = 0, amenities = [], sequenceNumber } = item[0]
        let duration = (properties.duration_Hour || 0) + 'h'
        if (properties.duration_Minute || 0 > 0) {
            duration += ' ' + properties.duration_Minute + 'm'
        }
        let { tripLocationDetails } = properties
        let fromLocation = tripLocationDetails.fromLocation||tripLocationDetails.FromLocation
        let toLocation = tripLocationDetails.toLocation||tripLocationDetails.ToLocation
        var title = `${fromLocation.city||fromLocation.City}, ${fromLocation.country||fromLocation.Country}(${fromLocation.id||fromLocation.ID}) - ${toLocation.city||toLocation.City}, ${toLocation.country||toLocation.Country}(${toLocation.id||toLocation.ID}), Duration : ${duration}, ${stops == 0 ? 'Non Stop' : stops + 'Stops'}`
        var fareRule = fareRules.find(o => o.sequence == sequenceNumber) || {}
        return (
            <View style={styles.container}>
                <View style={{ padding: 20 }}>
                    <Text style={styles.primary}>{title}</Text>
                    {item.map((way, index) => {
                        let { locationInfo, vendors, tpExtension, layOverDuration, code } = way
                        let pathName = `${locationInfo.fromLocation.name} (${locationInfo.fromLocation.id}) To ${locationInfo.toLocation.name} (${locationInfo.toLocation.id})`
                        let className = UtilService.getFieldFromList2(tpExtension, 'key', 'value', 'cabinClass')

                        return (
                            <View key={index}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.primary}>{moment(way.dateInfo.startDate).format('h:mm a')}</Text>
                                    <Text style={[styles.primary, { marginLeft: 20 }]}>{moment(way.dateInfo.endDate).format('h:mm a')}</Text>
                                    <Text style={[styles.primary, { marginLeft: 20 }]}>{UtilService.getDuration(way.dateInfo.startDate, way.dateInfo.endDate)}</Text>
                                </View>
                                <Text style={styles.lightText}>{pathName}</Text>
                                <Text style={styles.lightText}>{vendors[0].item.name} {code} {vendors[1].item.name} Operated By {vendors[1].item.name}</Text>
                                <Text style={styles.lightText}>{className}</Text>
                                {layOverDuration > 0 && <View style={styles.itemHeader}>
                                    <Feather name="clock" size={14} color={Color.orange} />
                                    <Text style={[styles.primary, { marginLeft: 20 }]}>{UtilService.getHourMin(layOverDuration)} Stop</Text>
                                    <Text style={[styles.primary, { marginLeft: 10 }]}>{`${locationInfo.toLocation.city}, ${locationInfo.toLocation.country}(${locationInfo.toLocation.id})`}</Text>
                                </View>}
                            </View>
                        )
                    })}

                </View>
                {amenities.length > 0 && <Text style={styles.normalTitle}>FACILITY</Text>}
                {amenities.length > 0 && <FlatList
                    numColumns={4}
                    data={amenities}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={styles.facilityIconContainer}>
                                <Image source={item.icon} style={styles.facilityIcon} />
                                <Text style={styles.facilityName}>{item.desc}</Text>
                            </View>
                        )
                    }}
                />}
                {fareRule.item && <View style={Platform.OS == 'ios'?styles.policyContainer:styles.policyContainerFull}>
                    <Text style={styles.normalTitle}>PRICE RULES</Text>
                    {Platform.OS == 'ios' && <ScrollView ref="ruleScroll" style={styles.scroll}>
                        {fareRule.item.map((policy, index) => (
                            <View key={index}>
                                <Text style={[styles.normalBold, { marginVertical: 10 }]}>{UtilService.decodeHtmlEntity(policy.key)}</Text>
                                <Text style={styles.normal}>{UtilService.decodeHtmlEntity(policy.value)}</Text>
                            </View>
                        ))}
                    </ScrollView>}
                    {Platform.OS != 'ios' && fareRule.item.map((policy, index) => (
                            <View key={index}>
                                <Text style={[styles.normalBold, { marginVertical: 10 }]}>{UtilService.decodeHtmlEntity(policy.key)}</Text>
                                <Text style={styles.normal}>{UtilService.decodeHtmlEntity(policy.value)}</Text>
                            </View>
                        ))}
                </View>}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    },
    primary: {
        fontSize: 12,
        fontWeight: 'bold',
        color: Color.primary
    },
    lightText: {
        fontSize: 10,
        color: Color.text
    },
    normalBold: {
        fontSize: 12,
        color: Color.darkText,
        fontWeight: 'bold'
    },
    normal: {
        color: Color.darkText,
        fontSize: 12,
    },
    orange: {
        fontSize: 14,
        color: Color.orange,
        fontWeight: 'bold'
    },
    infoContainer: {
        backgroundColor: Color.yellowBack,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: Color.orange,
        borderStyle: 'dashed',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 5,
        margin: 10
    },
    smallOrange: {
        fontSize: 10,
        color: Color.orange,
        flex: 1,
        marginLeft: 5
    },
    normalTitle: {
        fontSize: 12,
        color: Color.text,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 20
    },
    rowSpace: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 15
    },
    facilityIconContainer: {
        flex: 1,
        alignItems: 'center'
    },
    facilityIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain'
    },
    facilityName: {
        marginVertical: 8,
        fontSize: 10,
        textAlign: 'center'
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 5
    },
    policyContainer: {
        height: 300,
        padding: 15
    },
    policyContainerFull: {
        padding: 15
    },
    scroll: {
        backgroundColor: 'rgb(253,253,253)'
    }
})