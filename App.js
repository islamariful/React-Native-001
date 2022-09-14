import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, FlatList, Pressable, TouchableHighlight } from 'react-native';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from 'firebase/app';
import { collection, query, doc, getDoc, getFirestore } from 'firebase/firestore';
import ProgressBar from './progress.component'

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});


StyleSheet.create({
  square: {
    width: 100,
    height: 100,
    backgroundColor: "red",
  },
});

// Function to update challenge: TBD

function ChallengeListScreen({ navigation }) {

  const [dataset, setdataset] = React.useState({});
  const [isLoading, setisLoading] = React.useState(true);

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const interna = [];
    const db = getFirestore();
    const firebasCollection = collection(db, "challenges");
    const docRef = query(firebasCollection);

    const docSnapshot = firebase.firestore().collection("challenges").onSnapshot((snapshot) => {
      snapshot.forEach((doc) => {
        interna.push({key: doc.id});
      });
      setdataset(interna);
    });
    setisLoading(false);
    return () => docSnapshot();
  }

  if (isLoading) {
    console.log(isLoading);
    console.log(dataset);
    return <Text className="ChallengeListScreen">Loading...</Text>;
  }
  /*
<Pressable style={styles.item} onPress={console.log("pressed")}>
          <Text>{item.key}</Text>
        </Pressable>
  */

  return (
    <View style={styles.container}>
      <FlatList
        data={dataset}
        renderItem={({item}) => <Button 
        onPress={() => (console.log("pressed"))}
        title={item.key}
        ></Button>}
      />
    </View>
  );
}

function ProfileScreen({ navigation }) {

  const [userData, setuserData] = React.useState({});
  const [isLoading, setisLoading] = React.useState(true);

  React.useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const db = getFirestore();
    const docRef = doc(db, "users", "user_id");
    const docSnap = await getDoc(docRef);
    if(docSnap.empty){
      console.log("Document not found");
    } else {
      setuserData(docSnap.data());
      setisLoading(false);
    }
  }

  if (isLoading) {
    console.log(isLoading);
    console.log(dataset);
    return <Text className="ProfileScreen">Loading...</Text>;
  }


  return (
    <View style={[styles.container, {
        // Try setting `flexDirection` to `"row"`.
        flexDirection: "column",
        height: 100,
        padding: 20,
        margins: 20,
      }]}>
      <Text style = {[styles.paragraph, {
        fontWeight: 'bold',
        fontSize: 40,
        marginBottom: 20,
      }]}>{userData.name}</Text>
      <Text style = {[styles.paragraph, {
        fontSize: 25,
        marginBottom: 40,
      }]}>Total Points: {userData.Points}</Text>
      <Text style = {[styles.paragraph, {
        fontSize: 25,
        marginBottom: 40,
        color: 'green',
      }]}>Current Challenge: {userData.challengeInProgress}</Text>
      <Text style = {[styles.paragraph, {
        fontsize: 15,
        marginBottom: 7,
      }]}>Completed: 60%</Text>
      <View style = {styles.square, {
          width: 300,
          height: 16,
          borderColor: "black",
          borderWidth: 3,
          borderRadius: 20,
        }}>
        <View style = {styles.square, {
          width: 200,
          height: 10,
          backgroundColor: "orange",
          borderRadius: 20,
        }}></View>
      </View>
      <Button title='Challenges' onPress={() => navigation.navigate('Challenges')}></Button>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {

  const firebaseConfig = {
    // Use valid Config Details from firebase
    // Removed to revoke public Access
  }  // apiKey, authDomain, etc. (see above)
  
  initializeApp(firebaseConfig);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={ProfileScreen} />
        <Stack.Screen name="Challenges" component={ChallengeListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;