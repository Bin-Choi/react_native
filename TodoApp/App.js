import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./colors";
import { Fontisto, MaterialIcons } from "@expo/vector-icons";

const STORAGE_KEY = "@toDos";
const TAB_STATUS = "@status";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [isEditing, setIsEditing] = useState();

  useEffect(() => {
    loadToDos();
  }, []);

  const travel = () => {
    setWorking(false);
    saveStatus(false);
  };
  const work = () => {
    setWorking(true);
    saveStatus(true);
  };

  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const saveStatus = (status) => {
    AsyncStorage.setItem(TAB_STATUS, JSON.stringify(status));
  };
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    const status = await AsyncStorage.getItem(TAB_STATUS);
    setToDos(JSON.parse(s));
    setWorking(JSON.parse(status));
  };
  const addToDo = async () => {
    if (text === "") {
      return;
    }
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, working, ischecked: false },
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  const deleteToDo = async (key) => {
    Alert.alert("Delete To Do?", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "I'm Sure",
        style: "destructive",
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
    return;
  };

  const checkToDo = (key) => {
    const newTodos = { ...toDos };
    newTodos[key] = { ...newTodos[key], ischecked: !newTodos[key].ischecked };
    setToDos(newTodos);
    saveToDos(newTodos);
  };

  const onChangeText = (payload) => {
    setText(payload);
  };

  const onChangeEdit = (payload) => {
    const newTodos = { ...toDos };
    newTodos[isEditing] = { ...newTodos[isEditing], text: payload };
    setToDos(newTodos);
    saveToDos(newTodos);
  };

  const editTodos = (key) => {
    setIsEditing(key);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
          >
            travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        placeholder={working ? "Add a To Do" : "Where do you want to go?"}
        style={styles.input}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              {!isEditing && (
                <TouchableOpacity
                  style={styles.checkBox}
                  hitSlop={20}
                  onPress={() => checkToDo(key)}
                >
                  {toDos[key].ischecked ? (
                    <Fontisto
                      name="checkbox-passive"
                      size={18}
                      style={styles.todoIcon}
                    />
                  ) : (
                    <Fontisto
                      name="checkbox-active"
                      size={18}
                      style={styles.todoIcon}
                    />
                  )}
                </TouchableOpacity>
              )}
              {isEditing === key ? (
                <TextInput
                  autoFocus={true}
                  cursorColor="white"
                  value={toDos[isEditing].text}
                  onChangeText={onChangeEdit}
                  style={styles.editInput}
                />
              ) : (
                <Text
                  style={[
                    styles.toDoText,
                    toDos[key].ischecked ? styles.todoTextDone : null,
                  ]}
                >
                  {toDos[key].text}
                </Text>
              )}

              <View style={styles.iconBox}>
                {isEditing === key ? (
                  <TouchableOpacity hitSlop={20} onPress={() => editTodos()}>
                    <Entypo name="check" size={20} color="white" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity hitSlop={20} onPress={() => editTodos(key)}>
                    <Entypo name="edit" size={15} color="white" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => deleteTodo(key)}>
                  <Fontisto name="trash" size={15} color="salmon" />
                </TouchableOpacity>
              </View>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    color: "white",
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    fontSize: 18,
  },
  toDo: {
    marginVertical: 2,
    padding: 20,
    backgroundColor: theme.toDoBg,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  todoIcon: {
    // marginHorizontal: 5,
    // color: theme.grey,
    // position: "absolute",
    // left: 0,
  },
});
