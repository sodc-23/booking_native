import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity
} from 'react-native'

import BottomButton from '@components/general/bottomButton'
import Ionicons from '@expo/vector-icons/Ionicons';
import Color from '@common/color'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as packagesAction from '@store/packages';
import * as transfersAction from '@store/transfer';
import ModalDropdown from 'react-native-modal-dropdown'
import Global from "@utils/global";
import _ from 'lodash'
const { T1, T2 } = Global.Translate
import ModalSelector from '@react-native-modal-selector'

const Item = ({ title, value, onPress, noBorder }) => (
    <View style={[styles.itemContainer, { borderBottomWidth: noBorder ? 0 : 0.5 }]}>
        <Text style={styles.itemValueText}>{value}</Text>
        <Text style={styles.itemtitleText}>{title}</Text>
        <TouchableOpacity style={styles.removeContainer} onPress={() => onPress(false)}>
            <Ionicons name="ios-remove-circle-outline" size={24} color={Color.lightPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.plusContainer} onPress={() => onPress(true)}>
            <Ionicons name="ios-add-circle-outline" size={24} color={Color.lightPrimary} />
        </TouchableOpacity>
    </View>
)

const PassengerAge = ({ index, age }) => (
    <TouchableOpacity style={styles.ageContainer}>
        <Text style={styles.ageTitle}>Age of Guest {index}</Text>
        <Text style={styles.ageText}>{age}</Text>
        <Ionicons name="ios-arrow-forward" size={24} color={Color.lightPrimary} />
    </TouchableOpacity>
)

class SelectPassengerC extends PureComponent {
    constructor(props) {
        super(props)
        let business = this.props.business
        this.state = {
            value: this.props[business].passengers,
            passengers: this.props[business].ages||['25'],
            options: []
        }
        for (let i = 1; i < 100; i++) this.state.options.push({
            label:''+i, value:i
        })
        this.maxPassengers = Global.environment.availableBusinesses.activity.maxGroupCount
    }
    componentWillMount() {
        this.props.navigation.setParams({
            onRight: this.done.bind(this),
            rightTitle: 'DONE',
        });
    }
    done() {
        let business = this.props.business

        if (this.state.value == 0) {
            return alert('Please select one more passengers')
        }
        this.props.actions[business].setPassengers(this.state.value, this.state.passengers)
        Actions.pop()
    }

    onPress(inc) {
        if (!inc && this.state.value == 1) return
        if (inc && this.state.value >= this.maxPassengers) return
        if (inc) this.setState({ value: this.state.value + 1, passengers: [...this.state.passengers, 25] })
        else {
            this.state.passengers.pop()
            this.setState({ value: this.state.value - 1, passengers: [...this.state.passengers] })
        }
    }
    render() {
        let { value, passengers, options } = this.state
        return (
            <View style={styles.container}>
                <Item
                    value={value}
                    title="Persons"
                    onPress={(inc) => this.onPress(inc)}
                    noBorder
                />
                <ScrollView>
                    {passengers.map((age, index) => (
                        <ModalSelector 
                            key={index}
                            data={options}
                            onChange={(option) => {
                                passengers[index] = option.value
                                this.setState({ passengers: [...passengers] })
                            }}>
                            <PassengerAge age={age} index={index+1}/>
                        </ModalSelector>
                    ))}
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = ({ activity, vehicle, transfers, air, bus, packages }) =>
    ({ activity, vehicle, transfers, air, bus, package: packages });

const mapDispatchToProps = (dispatch) => ({
    actions: {
        package: bindActionCreators({ ...packagesAction }, dispatch),
        transfers: bindActionCreators({ ...transfersAction }, dispatch),
    }
});
export default SelectPassenger = connect(mapStateToProps, mapDispatchToProps)(SelectPassengerC);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    roomHeaderContainer: {
        height: 40,
        backgroundColor: Color.comment,
        flexDirection: 'row',
        paddingHorizontal: 15,
        alignItems: 'center'
    },
    headerText: {
        fontSize: 13,
        color: Color.text,
        flex: 1,
    },
    itemContainer: {
        height: 60,
        borderBottomColor: '#ccc',
        borderBottomWidth: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: 'white'
    },
    itemValueText: {
        fontSize: 24,
        color: 'black'
    },
    itemtitleText: {
        color: 'black',
        fontSize: 12,
        flex: 1,
        marginLeft: 10,
        marginTop: 8
    },
    removeContainer: {
        height: '100%',
        width: 40,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    plusContainer: {
        height: '100%',
        width: 40,
        marginLeft: 20,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    content: {
        paddingHorizontal: 15,
        backgroundColor: 'white'
    },
    spacer: {
        width: '100%',
        height: 0.5,
        backgroundColor: Color.border
    },
    ageContainer: {
        height: 50,
        backgroundColor: '#f7f7f7',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
    },
    ageTitle: {
        fontSize: 14,
        color: Color.darkText,
        flex: 1
    },
    ageText: {
        fontSize: 14,
        color: Color.orange,
        marginRight: 10
    }
})