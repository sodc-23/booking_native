import React, { PureComponent } from 'react'
import {
    View,
    ScrollView,
    StyleSheet,
    Text,
} from 'react-native'

import RoundButton from '@components/general/roundButton'
import CheckButton from '@components/general/checkButton'
import BookingCardList from './bookingCardList'
import BookingInputList from './bookingInputList'
import Color from '@common/color'
import {Actions} from 'react-native-router-flux'

export default class MyCart extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isAgreed: false,
            noItems: true,
        }
    }
    render() {
        let { isAgreed, noItems } = this.state
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={{ padding: 15 }}>
                        <RoundButton
                            bold
                            title="Add another Item"
                            onPress={() => Actions.jump('Home')}
                        />
                        {noItems&&<Text style={styles.info}>No item(s) are added in your cart yet.</Text>}
                        <BookingCardList />
                        <BookingInputList />
                        {!noItems&&<View style={styles.termsContainer}>
                            <CheckButton
                                value={isAgreed}
                                onPress={() => this.setState({ isAgreed: !this.state.isAgreed })}
                            />
                            <Text style={styles.termsText}>
                                I have READ and AGREED to all the
                                <Text onPress={() => {}} style={styles.linkText}> Terms and Conditions </Text>
                                (Please note the Terms and Condistions are besides the individual items listed above)
                            </Text>
                        </View>}
                        {!noItems&&<RoundButton
                            bold
                            disabled={!isAgreed}
                            disabledUI={!isAgreed}
                            title="Checkout"
                            onPress={() => { Actions.PriceDetail()}}
                        />}
                    </View>
                </ScrollView>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    termsContainer: {
        flexDirection: 'row',
        marginTop: 30,
        marginBottom:20
    },
    termsText: {
        color: Color.text,
        fontSize: 14,
        marginLeft: 10,
        flex:1
    },
    linkText:{
        color: Color.text,
        fontSize: 14,
        fontWeight:'bold',
        textDecorationLine: 'underline',
    },
    info:{
        fontSize:14,
        color:Color.darkText,
        textAlign:'center',
        marginTop:15
    }
})