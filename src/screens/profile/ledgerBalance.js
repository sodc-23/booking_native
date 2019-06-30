import React from 'react'

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator
} from 'react-native'

import Color from '@common/color'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cartActions from '@store/cart';
import moment from 'moment'

const LedgerItem = ({ debitAmount, creditAmount, ...props }) => (
    <View style={styles.itemContainer}>
        <View>
            <Text style={styles.itemType}>{props.transactionType}</Text>
            <Text style={styles.normalText}>{props.itineraryRefNo}</Text>
            <Text style={styles.normalText}>{props.bookingRefNo}</Text>
        </View>
        <View style={styles.rightContent}>
            <Text style={styles.normalText}>{moment(props.transactionDate).format('DD MMM, YYYY')}</Text>
            <Text style={[styles.amount, { color: debitAmount == "0" ? Color.lightPrimary : Color.orange }]}>
                {debitAmount == "0" ? creditAmount : debitAmount}
            </Text>
        </View>
    </View>
)


class LedgerBalance extends React.Component {
    constructor(props) {
        super(props)
        const currentPage = 1
        const pageLength = 20
        if ( props.actions && props.actions.getLedgerEntries )
            props.actions.getLedgerEntries(currentPage, pageLength)
    }

    render() {
        let { ledgerEntries, status } = this.props.cart
        const agentBalance = ledgerEntries != null ? 
            ledgerEntries.agentCurrencySymbol+' '+ledgerEntries.agentBalance : null
        const data = (ledgerEntries != null ? ledgerEntries.data : null) || []
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>CURRENT BALANCE</Text>
                    {agentBalance != null && <Text style={styles.headerValue}>{agentBalance}</Text>}
                    {agentBalance == null && status == 'LOADING' &&
                        <ActivityIndicator size="small" color="white" style={{ marginTop: 15 }} />}
                </View>
                <View style={styles.content}>
                    {data.length == 0 && <Text style={styles.noData}>There is no ledger entries.</Text>}
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => <LedgerItem {...item} />}
                    />

                </View>
            </View>
        )
    }
}

const mapStateToProps = ({ cart }) => ({ cart });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...cartActions }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LedgerBalance);
// export default LedgerBalance
// LedgerBalance.defaultProps={
//     ledgerEntries:{
//         Data:[
//             {
//                 "RowNumber": 3,
//                 "TransactionDate": "2017-07-27T17:08:28.76",
//                 "OpeningBalance": "Ks 3691275.41",
//                 "DebitAmount": "Ks 39600.00",
//                 "CreditAmount": "0",
//                 "ClosingBalance": "0",
//                 "Reason": "Reservation",
//                 "TransactionType": "Reservation",
//                 "ItineraryRefNo": "GAT0717-AA00591",
//                 "BookingRefNo": "0717-AA01150"
//             },
//             {
//                 "RowNumber": 4,
//                 "TransactionDate": "2017-07-27T16:17:40.947",
//                 "OpeningBalance": "Ks 3728875.41",
//                 "DebitAmount": "0",
//                 "CreditAmount": "Ks 39600.00",
//                 "ClosingBalance": "Ks 3689275.41",
//                 "Reason": "Reservation",
//                 "TransactionType": "Reservation",
//                 "ItineraryRefNo": "GAT0717-AA00590",
//                 "BookingRefNo": "0717-AA01149"
//             },
//             {
//                 "RowNumber": 5,
//                 "TransactionDate": "2017-07-27T16:13:20.893",
//                 "OpeningBalance": "Ks 3767475.41",
//                 "DebitAmount": "Ks 39600.00",
//                 "CreditAmount": "0",
//                 "ClosingBalance": "Ks 3727875.41",
//                 "Reason": "Reservation",
//                 "TransactionType": "Reservation",
//                 "ItineraryRefNo": "GAT0717-AA00589",
//                 "BookingRefNo": "0717-AA01148"
//             },
//             {
//                 "RowNumber": 6,
//                 "TransactionDate": "2017-07-21T11:30:27.457",
//                 "OpeningBalance": "Ks 3803475.41",
//                 "DebitAmount": "Ks 39600.00",
//                 "CreditAmount": "0",
//                 "ClosingBalance": "Ks 3763875.41",
//                 "Reason": "Reservation",
//                 "TransactionType": "Reservation",
//                 "ItineraryRefNo": "GAT0717-AA00574",
//                 "BookingRefNo": "0717-AA01098"
//             }
//         ],
//         "AgentBalance": 3623375.41,
//         "AgentCurrencySymbol": "Ks",
//     }
// }

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerContainer: {
        backgroundColor: Color.lightPrimary,
        paddingVertical: 20,
        alignItems: 'center'
    },
    headerTitle: {
        color: 'white',
        fontSize: 14
    },
    headerValue: {
        fontSize: 24,
        marginTop: 8,
        color: 'white'
    },
    content: {
        paddingHorizontal: 20,
        backgroundColor: 'white',
        flex: 1
    },
    itemContainer: {
        paddingVertical: 15,
        paddingHorizontal: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc'
    },
    itemType: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Color.primary,
        marginBottom: 5
    },
    normalText: {
        fontSize: 12,
        color: Color.text,
        marginBottom: 5
    },
    amount: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    rightContent: {
        alignItems: 'center'
    },
    noData: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 14,
        color: Color.text
    }
})