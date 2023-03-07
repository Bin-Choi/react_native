import { StatusBar } from 'expo-status-bar';
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { theme } from './colors'

export default function App() {
  const [working, setWorking] = useState(true)
  const [text, setText] = useState("")
  const travel = () => setWorking(false)
  const work = () => setWorking(true)
  const onChangeText = (payload) => setText(event)
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{ ...styles.btnText, color: working? "white" : theme.grey }}>work</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={travel}>
          <Text style={{ ...styles.btnText, color: !working? "white" : theme.grey }}>travel</Text>
        </TouchableOpacity>
      </View>
        <TextInput
          onChangeText={onChangeText}
          placeholder={working? "Add a To Do" : "Where do you want to go?"}
          style={styles.input}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header:{
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100
,  },
  btnText: {
    color: "white",
    fontSize: 38, 
    fontWeight: "600",
  } ,
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    fontSize: 18,

  }
});