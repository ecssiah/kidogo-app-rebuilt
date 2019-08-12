import React from 'react'
import {
  Modal, View, Text, TextInput, TouchableOpacity
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Colors, Styles } from '../constants/Style';

const ConfirmModal = (props) => {
  const [code1, setCode1] = React.useState('')
  const [code2, setCode2] = React.useState('')
  const [code3, setCode3] = React.useState('')
  const [code4, setCode4] = React.useState('')
  const [code5, setCode5] = React.useState('')
  const [code6, setCode6] = React.useState('')


  const onCodeSubmit = async () => {
    const code = code1 + code2 + code3 + code4 + code5 + code6

    try {
      resetCode()
      props.onConfirmAttempt(code)
    } catch(error) {
      console.error(error)
    }
  }


  const onResend = async () => {
    console.log("resend code")
  }


  const resetCode = () => {
    setCode1('')
    setCode2('')
    setCode3('')
    setCode4('')
    setCode5('')
    setCode6('')
  }


  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.visible}
      onRequestClose={() => { }}
    >
      <LinearGradient
        style={{ flex: 1 }}
        colors={[Colors.gradient_dark, Colors.gradient_light]}
      >
        <Text
          style={{
            margin: 18, color: '#ffffff80', fontSize: 22
          }}
        >
          You will receive a text message with a 6-digit code.
          Please enter the code below:
        </Text>

        <View
          style={{
            flexDirection: 'row',
            marginTop: 100,
            marginHorizontal: 10,
            justifyContent: 'space-between',
          }}
        >
          <TextInput
            style={Styles.codeInput}
            maxLength={1}
            textAlign={'center'}
            keyboardType="number-pad"
            value={code1}
            onChangeText={setCode1}
          />

          <TextInput
            style={Styles.codeInput}
            maxLength={1}
            textAlign={'center'}
            keyboardType="number-pad"
            value={code2}
            onChangeText={setCode2}
          />

          <TextInput
            style={Styles.codeInput}
            maxLength={1}
            textAlign={'center'}
            keyboardType="number-pad"
            value={code3}
            onChangeText={setCode3}
          />

          <TextInput
            style={Styles.codeInput}
            maxLength={1}
            textAlign={'center'}
            keyboardType="number-pad"
            value={code4}
            onChangeText={setCode4}
          />

          <TextInput
            style={Styles.codeInput}
            maxLength={1}
            textAlign={'center'}
            keyboardType="number-pad"
            value={code5}
            onChangeText={setCode5}
          />

          <TextInput
            style={Styles.codeInput}
            maxLength={1}
            textAlign={'center'}
            keyboardType="number-pad"
            value={code6}
            onChangeText={setCode6}
          />
        </View>

        <View style={{ flexDirection: 'row', margin: 10 }}>
          <TouchableOpacity
            style={[Styles.button, { flex: 0.5, marginRight: 5 }]}
            onPress={onResend}
          >
            <Text style={Styles.btnText}>
              Resend
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[Styles.button, { flex: 0.5, marginLeft: 5 }]}
            onPress={onCodeSubmit}
          >
            <Text style={Styles.btnText}>
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Modal>
  )
}

export default ConfirmModal
