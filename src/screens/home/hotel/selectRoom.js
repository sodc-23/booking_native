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
import * as hotelAction from '@store/hotel';
import ModalDropdown from 'react-native-modal-dropdown'
import Global from "@utils/global";
import _ from 'lodash'
const {T1, T2} = Global.Translate

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

const Room = ({ adults, children, infants, onPress, index, ageRange, onAgeChanged, T3 }) => (
    <View>
        <View style={styles.roomHeaderContainer}>
            <Text style={styles.headerText}>{T3('Room')} {index + 1}</Text>
            {index > 0 && <TouchableOpacity onPress={() => onPress('DELETE')} style={styles.removeTitleContainer}>
                <Ionicons name="ios-remove-circle-outline" size={18} color={Color.orange} />
                <Text style={styles.removeRoomText}>{' Remove'}</Text>
            </TouchableOpacity>}
        </View>
        <View style={styles.content}>
            <Item
                title={T3("Adult(s)")}
                value={adults}
                onPress={(inc) => onPress(inc ? 'INC_ADULTS' : 'DEC_ADULTS')} />
            <Item
                title={T3("Children")}
                value={children.length}
                onPress={(inc) => onPress(inc ? 'INC_CHILDREN' : 'DEC_CHILDREN')} />
            {/* <Item
                title="Infants"
                value={infants}
                noBorder
                onPress={(inc) => onPress(inc ? 'INC_INFANTS' : 'DEC_INFANTS')} /> */}

        </View>
        <View style={styles.spacer} />
        {children && children.map((child, index) => (

            <ModalDropdown
                key={index}
                options={ageRange}
                defaultIndex={child}
                onSelect={(idx, value) => onAgeChanged(index, value)}
                renderRow={(option, index, isSelected) => <View style={styles.childItemContainer}>
                    <Text style={[styles.childAge, { color: isSelected ? Color.orange : Color.darkText }]}>{option==1?'<1':option}</Text>
                </View>}
                dropdownStyle={{ height: 200 }}
                adjustFrame={style => {
                    style.right = 10;
                    style.left = undefined;
                    style.padding = 10
                    return style
                }}
            >
                <View style={styles.childContainer}>
                    <Text style={styles.childText}>{T3('Child')} {index + 1}</Text>
                    <Text style={styles.childAge}>{child==1?'<1':child}</Text>
                    <Ionicons name="ios-arrow-down" size={24} color={Color.text} />
                </View>
            </ModalDropdown>

        ))}
    </View>
)

let selectRoomView = null
class SelectRoomC extends PureComponent {
    constructor(props) {
        super(props)
        this.paxConfigInfo = Global.environment.availableBusinesses.hotel.paxConfigInfo
        let childMinAge = this.paxConfigInfo.child.minAge == 0?1:this.paxConfigInfo.child.minAge
        let childMaxAge = this.paxConfigInfo.child.maxAge
        this.maxGroupCount = Global.environment.availableBusinesses.hotel.maxGroupCount

        this.state = {
            rooms: this.props.hotel.rooms,
            ageRange: _.range(childMinAge, childMaxAge)
        }

        this.defaultChildAge = childMinAge

        selectRoomView = this
    }
    componentWillMount() {
        const {T3, T2} = this.props.language
        this.props.navigation.setParams({
            onRight: this.done,
            rightTitle: T2('DONE'),
            title:T3('Guest Details')
        });
    }
    done() {
        selectRoomView.props.actions.selectRoom(selectRoomView.state.rooms)
        Actions.pop()
    }
    changeRoomState(index, type) {
        let item = this.state.rooms[index]
        switch (type) {
            case 'DELETE':
                this.state.rooms.splice(index, 1); break;
            case 'INC_ADULTS':
                item.adults++; break;
            case 'DEC_ADULTS':
                item.adults--; break;
            case 'INC_CHILDREN':
                if (item.children.length < this.paxConfigInfo.child.max)
                    item.children.push(this.defaultChildAge);
                break;
            case 'DEC_CHILDREN':
                if (item.children.length > this.paxConfigInfo.child.min)
                    item.children.splice(item.children.length - 1, 1);
                break;
            case 'INC_INFANTS':
                item.infants++; break;
            case 'DEC_INFANTS':
                item.infants--; break;
        }
        if (item.adults < this.paxConfigInfo.adult.min) item.adults = this.paxConfigInfo.adult.min
        if (item.adults > this.paxConfigInfo.adult.max) item.adults = this.paxConfigInfo.adult.max
        if (item.infants < 0) item.infants = 0

        this.setState({ rooms: [...this.state.rooms] })
    }
    addRoom() {
        if (this.maxGroupCount > 0) {
            if (this.state.rooms.length == this.maxGroupCount) {
                return
            }
        }
        this.state.rooms.push({ adults: 2, children: [], infants: 0 })
        this.setState({ rooms: [...this.state.rooms] })
    }
    render() {
        const {T3} = this.props.language
        return (
            <View style={styles.container}>
                <ScrollView>
                    {this.state.rooms.map((room, index) => (
                        <Room
                            key={index}
                            index={index}
                            {...room}
                            onPress={(type) => this.changeRoomState(index, type)}
                            onAgeChanged={(index, age) => {
                                room.children[index] = age
                                this.setState({ rooms: [...this.state.rooms] })
                            }}
                            ageRange={this.state.ageRange}
                            T3={T3}
                        />
                    ))}
                    <View style={{height:50}}/>
                </ScrollView>
                
                <BottomButton
                    title={T3("Add Another Room")}
                    onPress={() => this.addRoom()}
                />
            </View>
        )
    }
}

const mapStateToProps = ({ hotel, language }) => ({ hotel, language });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...hotelAction }, dispatch)
});
export default SelectRoom = connect(mapStateToProps, mapDispatchToProps)(SelectRoomC);

const styles = StyleSheet.create({
    container: {
        flex: 1
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
    removeRoomText: {
        color: Color.text,
        fontSize: 10,
        marginLeft: 5
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
        color: 'black',
        fontSize: 18,
        flex: 1,
        marginLeft: 15
    },
    removeContainer: {
        height: '100%',
        width: 60,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    plusContainer: {
        height: '100%',
        width: 60,
        marginLeft: 20,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    removeTitleContainer: {
        flexDirection: 'row',
        height: '100%',
        alignItems: 'center'
    },
    content: {
        paddingHorizontal: 15,
        backgroundColor: 'white'
    },
    childAge: {
        color: Color.darkText,
        fontSize: 18,
        marginRight: 15
    },
    childItemContainer: {
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        width: 100
    },
    childContainer: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Color.lightBack,
        width: '100%',
        paddingHorizontal: 15,
    },
    childText: {
        fontSize: 16,
        color: Color.text,
        flex: 1,
        marginLeft: 10
    },
    spacer: {
        width: '100%',
        height: 0.5,
        backgroundColor: Color.border
    }
})