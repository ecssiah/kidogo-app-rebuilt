import React, { useEffect, useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useDispatch, useSelector } from 'react-redux'
import {
  Image, Modal, Picker, ScrollView, Text, TextInput, View, TouchableOpacity,
} from 'react-native'
import Language from '../languages'
import { Styles, Size } from '../constants/Style'
import Backdrop from './Backdrop'
import Spacer from './Spacer'
import { ADD_PAYMENT, FinanceType, FinanceTypeNames, PaymentType, UPDATE_INCOME } from '../constants/Finances'
import { Update, Get } from '../utilities/localstore'
import { PAYMENTS, FINANCES } from '../constants/Store'
import { GetShortDate } from '../utilities/dates'
import uuid from 'uuid'


const PaymentModal = (props) => {
  const dispatch = useDispatch()
  const accounts = useSelector(state => state.accounts)
  const guardians = useSelector(state => state.guardians)

  const [accountId, setAccountId] = useState(null)
  const [date, setDate] = useState(GetShortDate())
  const [type, setType] = useState(FinanceType.MPesa)
  const [amount, setAmount] = useState('100')


  const getPaymentTypeItems = () => {
    return Object.values(PaymentType).map((type, i) =>
      <Picker.Item key={i} label={FinanceTypeNames[type]} value={type} />
    )
  }


  const getFamilyItems = () => {
    return Object.entries(accounts).map(([id, account]) =>
      <Picker.Item
        key={id}
        label={guardians[account.guardians[0]].lastName}
        value={id}
      />
    )
  }


  const onDateSelection = () => {
  }


  const onSubmitPayment = async () => {
    const payment = { accountId, type, amount }
    const update = { [uuid()]: payment }

    dispatch({ type: ADD_PAYMENT, id: date, payment: update })
    await Update(PAYMENTS, date, update)

    const paymentAmount = parseFloat(payment.amount)
    const finances = await Get(FINANCES)

    const financesUpdate = {
      income: parseFloat(finances[date].income) + paymentAmount
    }

    dispatch({ type: UPDATE_INCOME, id: date, amount: paymentAmount })
    await Update(FINANCES, date, financesUpdate)

    props.setVisible(false)
  }


  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.visible}
      onRequestClose={() => { }}
    >
      <Backdrop>
        <ScrollView>
          <Text style={[Styles.h1, Styles.raleway]} >
            { Language.Payment }
          </Text>

          <View style={Styles.rowElements} >
            <View style={Styles.rowElement} >
              <View style={[Styles.input, { height: 30, paddingLeft: 0 }]} >
                <Picker
                  style={{ color: 'white', marginTop: -10 }}
                  selectedValue={accountId}
                  onValueChange={(value, pos) => setAccountId(value)}
                >
                  { getFamilyItems() }
                </Picker>
              </View>

              <Text style={Styles.label} >
                { Language.Family }
              </Text>
            </View>

            <View style={Styles.rowElement} >
              <TouchableOpacity
                style={Styles.rowButton}
                onPress={onDateSelection}
              >
                <Text style={Styles.buttonText} >
                  { date }
                </Text>
              </TouchableOpacity>

              <Text style={Styles.label} >
                { Language.Date }
              </Text>
            </View>
          </View>

          <View style={Styles.rowElements} >
            <View style={Styles.rowElement} >
              <View style={[Styles.input, { height: 30, paddingLeft: 0 }]} >
                <Picker
                  style={{ color: 'white', marginTop: -10 }}
                  selectedValue={type}
                  onValueChange={(value, pos) => setType(value)}
                >
                  { getPaymentTypeItems() }
                </Picker>
              </View>

              <Text style={Styles.label} >
                { Language.Type}
              </Text>
            </View>

            <View style={Styles.rowElement} >
              <TextInput
                style={Styles.dateInput}
                maxLength={10}
                keyboardType="number-pad"
                value={amount}
                onChangeText={setAmount}
              />

              <Text style={Styles.label} >
                { Language.Amount }
              </Text>
            </View>
          </View>

          <Spacer medium />

          <View style={Styles.rowElements} >
            <TouchableOpacity
              style={Styles.rowButton}
              onPress={() => props.setVisible(false)}
            >
              <Text style={Styles.buttonText} >
                { Language.Cancel }
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={Styles.rowButton}
              onPress={onSubmitPayment}
            >
              <Text style={Styles.buttonText} >
                { Language.Confirm }
              </Text>
            </TouchableOpacity>
          </View>

          <Spacer height={Size.keyboard} />
        </ScrollView>
      </Backdrop>
    </Modal>
  )
}

export default PaymentModal

