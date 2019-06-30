import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    ScrollView,
    Alert,
    Text,
    TouchableOpacity
} from 'react-native'

import BottomButton from '@components/general/bottomButton'
import Ionicons from '@expo/vector-icons/Ionicons';
import Color from '@common/color'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as airAction from '@store/air';
import Global from "@utils/global";
import _ from 'lodash'
const { T1, T2 } = Global.Translate

const Item = ({ title, value, description, onPress, noBorder }) => (
    <View style={[styles.itemContainer, { borderBottomWidth: noBorder ? 0 : 0.5 }]}>
        <Text style={styles.itemValueText}>{value}</Text>
        <View style={styles.textContainer}>
            <Text style={styles.itemtitleText}>{title}</Text>
            <Text style={styles.itemDescText}>{description}</Text>
        </View>
        <TouchableOpacity style={styles.removeContainer} onPress={() => onPress(false)}>
            <Ionicons name="ios-remove-circle-outline" size={24} color={Color.lightPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.plusContainer} onPress={() => onPress(true)}>
            <Ionicons name="ios-add-circle-outline" size={24} color={Color.lightPrimary} />
        </TouchableOpacity>
    </View>
)

class SelectPassengerC extends PureComponent {
    constructor(props) {
        super(props)
        let business = this.props.business
        this.state = {
            passengers: JSON.parse(JSON.stringify(this.props[business].passengers))
        }
    }
    componentWillMount() {
        this.props.navigation.setParams({
            onRight: this.done.bind(this),
            rightTitle: 'DONE',
        });
    }
    done() {
        let business = this.props.business
        let { passengers } = this.state

        if (passengers.adults == 0) {
            return alert('Please select one more adult')
        }
        this.props.actions[business].setPassengers(passengers)
        Actions.pop()
    }

    onPress1(inc) {
        let { passengers } = this.state
        if (!inc && passengers.adults == 1) return

        if (inc) {
            passengers.adults++
            this.setState({ passengers })
        } else {
            passengers.adults--
            this.setState({ passengers })
        }
        this.forceUpdate()
    }
    onPress2(inc) {
        let { passengers } = this.state
        if (!inc && passengers.children == 0) return

        if (inc) {
            passengers.children++
            this.setState({ passengers })
        } else {
            passengers.children--
            this.setState({ passengers })
        }
        this.forceUpdate()
    }
    onPress3(inc) {
        let { passengers } = this.state
        if (!inc && passengers.infants == 0) return
        if (inc) {
            if (passengers.infants >= passengers.adults) {
                Alert.alert('Information', 'You can select infants less than aduls. Will you increase adults too?', [
                    {
                        text: 'OK', onPress: () => {
                            passengers.infants++
                            passengers.adults++
                            this.setState({ passengers:{...passengers} })
                        }
                    },
                    { text: 'Cancel', onPress: () => { } , style:'cancel'}
                ])
            } else {
                passengers.infants++
                this.setState({ passengers })
            }

        } else {
            passengers.infants--
            this.setState({ passengers })
        }
        this.forceUpdate()
    }
    render() {
        let { passengers } = this.state
        return (
            <View style={styles.container}>
                <Item
                    value={passengers.adults}
                    title="Adult"
                    description="(>12 years)"
                    onPress={(inc) => this.onPress1(inc, 0)}
                // noBorder
                />
                <Item
                    value={passengers.children}
                    title="Child"
                    description="(2 - 12 years)"
                    onPress={(inc) => this.onPress2(inc, 1)}
                // noBorder
                />
                <Item
                    value={passengers.infants}
                    title="Infant"
                    description="(<2 years)"
                    onPress={(inc) => this.onPress3(inc, 2)}
                // noBorder
                />
            </View>
        )
    }
}

const mapStateToProps = ({ air }) => ({ air });

const mapDispatchToProps = (dispatch) => ({
    actions: {
        air: bindActionCreators({ ...airAction }, dispatch),
    }
});
export default SelectPassenger = connect(mapStateToProps, mapDispatchToProps)(SelectPassengerC);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 10,
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
        paddingHorizontal: 10,
        backgroundColor: 'white'
    },
    itemValueText: {
        fontSize: 24,
        color: 'black'
    },
    itemtitleText: {
        color: Color.primary,
        fontSize: 14,
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
    itemDescText: {
        fontSize: 9,
        color: Color.lightText,
        marginTop: 5
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    }
})