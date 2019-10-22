import React, { useState } from 'react';
import { useDispatch } from 'react-redux'
import {
  View, Text, TouchableOpacity, ScrollView
} from 'react-native';
import { Audio } from 'expo-av'
import { Styles } from '../constants/Style';
import { Icon } from 'react-native-elements'
import {
  SignUpCaregiver, SignInCaregiver, ConfirmCaregiver
} from '../utilities/auth'
import { CreateCaregiver, InitDatabase, UpdateStore } from '../utilities/localstore';
import bcrypt from 'react-native-bcrypt'
import uuid from 'uuid'

import Loading from '../components/Loading'
import Spacer from '../components/Spacer'
import CaregiverEntry from '../components/CaregiverEntry'
import CentreEntry from '../components/CentreEntry'
import ConfirmModal from '../components/ConfirmModal';
import Message from '../components/Message';
import { CreateCaregiverDB } from '../utilities/dbstore';
import Backdrop from '../components/Backdrop';
import Language from '../languages'


const SignUp = (props) => {
  const dispatch = useDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [centreName, setCentreName] = useState('')
  const [address, setAddress] = useState('')
  const [location, setLocation] = useState('')
  const [city, setCity] = useState('')
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [soundObject, setSoundObject] = useState(null)
  const [confirmModalVisible, setConfirmModalVisible] = useState(false)


  const onSignUp = async () => {
    setLoading(true)

    const userData = {
      username,
      password,
      email,
      phone,
    }

    await SignUpCaregiver(userData)

    setLoading(false)
    setConfirmModalVisible(true)
  }


  const onConfirmAttempt = async (code) => {
    const confirmResult = await ConfirmCaregiver(username, code)

    if (confirmResult === 'SUCCESS') {
      const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            reject(err)
          }
          resolve(hash)
        })
      })

      const caregiverData = {
        id: uuid(),
        username,
        password: hashedPassword,
        email,
        firstName,
        lastName,
        phone,
        centreName,
        address,
        location,
        city,
      }

      await SignInCaregiver(username, password)

      await CreateCaregiver(caregiverData)
      await CreateCaregiverDB(caregiverData)

      setConfirmModalVisible(false)

      await InitDatabase(dispatch)
      await UpdateStore(dispatch)

      props.navigation.navigate('Dash')
    } else {
      console.error("Caregiver confirmation failed")
    }
  }


  const toggleHelpAudio = async () => {
    try {
      if (soundObject) {
        await soundObject.stopAsync()

        setSoundObject(null)
      } else {
        const soundObject = new Audio.Sound()
        await soundObject.loadAsync(require('../assets/audio/signup.mp3'))
        await soundObject.playAsync()

        setSoundObject(soundObject)
      }
    } catch(error) {
      console.error(error)
    }
  }


  return (
    <Backdrop>
      <Message text={message} />

      {loading
        ? <Loading />
        : <ScrollView >
            <Spacer height={40} />

            <CaregiverEntry
              username={username}
              password={password}
              email={email}
              firstName={firstName}
              lastName={lastName}
              phone={phone}
              onChangeUsername={setUsername}
              onChangePassword={setPassword}
              onChangeEmail={setEmail}
              onChangeFirstName={setFirstName}
              onChangeLastName={setLastName}
              onChangePhone={setPhone}
            />

            <CentreEntry
              centreName={centreName}
              address={address}
              location={location}
              city={city}
              onChangeCentreName={setCentreName}
              onChangeAddress={setAddress}
              onChangeLocation={setLocation}
              onChangeCity={setCity}
            />

            <Spacer large />

            <TouchableOpacity
              style={Styles.mainButton}
              onPress={onSignUp}
            >
              <Text style={Styles.buttonText}>{ Language.Confirm }</Text>
            </TouchableOpacity>

            <Spacer height={322} />
          </ScrollView>
      }

      <TouchableOpacity
        style={Styles.helpButton}
        onPress={toggleHelpAudio}
      >
        <View style={Styles.helpButtonIcon} >
          <Icon name="record-voice-over" color="#3C233D" size={36} />
        </View>
      </TouchableOpacity>

      <ConfirmModal
        visible={confirmModalVisible}
        onConfirmAttempt={onConfirmAttempt}
      />
    </Backdrop>
  )
}

export default SignUp
