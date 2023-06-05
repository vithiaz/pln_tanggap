import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'

import LottieLoader from '../assets/lottie/loader.json'

export default function Loader() {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
      <LottieView source={LottieLoader} autoPlay loop/>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        zIndex: 201
    }
})