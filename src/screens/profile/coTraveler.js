import React from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native'

import Color from '@common/color'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Global from "@utils/global";
import * as coTravelerAction from '@store/cotraveller';
import * as commonAction from '@store/common';

const TravellerItem = ({ userDisplayName, onEdit, onDelete, language:{T3} }) => (
    <View style={styles.itemContainer}>
        <Text style={styles.nameText}>{userDisplayName}</Text>
        <View style={styles.row}>
            <TouchableOpacity onPress={() => onDelete()} style={styles.row}>
                <MaterialIcons name="close" size={18} color={Color.lightPrimary} />
                <Text style={styles.smallLightPrimary}>{'  '+T3('Delete')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onEdit()} style={[styles.row, { marginLeft: 15 }]}>
                <MaterialIcons name="edit" size={18} color={Color.lightPrimary} />
                <Text style={styles.smallLightPrimary}>{'  '+T3('Edit')}</Text>
            </TouchableOpacity>
        </View>
    </View>
)

class CoTravelerC extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            description: 'For your convenience, you can store Traveler information for your fellow Travelers, like friends and family then, when making a reservation, save time by simply selecting the traveler from the list. You can add or delete names from your list of travelers at any time.',
            travellers: [
                { name: 'John Smith' },
                { name: 'Bill Gates' },
            ]
        }

        this.props.actions.getCoTravelers()
    }

    add() {
        Actions.EditTraveler()
    }

    componentWillMount() {
        this.props.navigation.setParams({
            onRight: () => Actions.Notifications(),
            notifications: 3,
        });
    }

    deleteTraveler(item) {
        let {T1} = this.props.language
        let userData = JSON.parse(JSON.stringify(item))
        this.props.actions.deleteCoTraveler(userData).then(({ error, result }) => {
            if (error) {
                alert(error.message)
                return
            }
            this.props.commonAction.showToast(T1('message45'))
            this.props.actions.getCoTravelers()
        })
    }

    render() {
        let { description, travellers } = this.state
        let { coTravelers } = this.props.cotraveller
        let {T4} = this.props.language
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => this.add()} style={styles.buttonContainer}>
                    <Text style={styles.whiteText}>{T4('ADD CO-TRAVELER')}</Text>
                </TouchableOpacity>
                <ScrollView>
                    <View style={styles.content}>
                        <Text style={styles.descText}>{description}</Text>
                        {coTravelers.map((item, index) =>
                            <TravellerItem
                                key={index}
                                {...item}
                                language={this.props.language}
                                onEdit={() => { Actions.EditTraveler({ coTraveler: item }) }}
                                onDelete={() => this.deleteTraveler(item)}
                            />)}
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = ({ cotraveller, language }) => ({ cotraveller, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...coTravelerAction }, dispatch),
    commonAction: bindActionCreators({ ...commonAction }, dispatch)
});

export default CoTraveler = connect(mapStateToProps, mapDispatchToProps)(CoTravelerC);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    content: {
        padding: 20
    },
    buttonContainer: {
        backgroundColor: Color.lightPrimary,
        height: 44,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    whiteText: {
        fontSize: 12,
        color: 'white'
    },
    descText: {
        fontSize: 10,
        color: Color.lightText
    },
    nameText: {
        fontSize: 13,
        color: Color.primary,
        fontWeight: 'bold'
    },
    smallLightPrimary: {
        fontSize: 10,
        color: Color.lightPrimary
    },
    itemContainer: {
        height: 34,
        width: '100%',
        paddingRight: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        marginTop: 10
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})