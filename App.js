import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Text, View, Button, TextInput } from 'react-native';

//vector icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

//navigation modules
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//To allow for launching of browser within the app
import * as WebBrowser from 'expo-web-browser';

//Welcome Screen Markup
function WelcomeScreen({ navigation }) {

  const openSingPass = () => {
    WebBrowser.openBrowserAsync('https://www.singpass.gov.sg/home/ui/login');
  }

  return (
    <View style={{ flex:1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{color:'red', fontSize:90, fontWeight:'bold', letterSpacing:-1}}>RedD<Image style={{width:80, height:80}} source={require('./assets/RedDOT-Logo.jpg')}/>t</Text>
      <Text style={{color:'white', fontSize: 20, fontWeight: 'bold',marginBottom: 20}}>Connecting You Always</Text>
      <TouchableOpacity style={styles.welcomeButtons} activeOpacity={0.5} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.welcomeButtonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.welcomeButtons} activeOpacity={0.5} onPress={openSingPass}>
        <Text style={styles.welcomeButtonText}>Register with <Image style={{width:104, height:25}} source={require('./assets/singpass-logo.png')}/></Text>
      </TouchableOpacity>
    </View>
  )
}

//Login Screen Markup
function LoginScreen({ navigation }) {

  const [username, onChangeUsername] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [errorState, onChangeErrorState] = React.useState('transparent');

  const verifyUserDetails = () => {
    /*INSERT DB CONNECTION HERE:
      1. The global variables 'username' and 'password' each refer to the respective values of the entry fields as entered by the user.
      2. Connect to the database, and if a match is found, execute the 'if' statement.
      3. If no match is found, execute the 'else' statement.*/

    //pseudo code, EDIT THE CONDITION
    if(username == 'james') {
      /*
      navigation.navigate('Navigation', {
        screen: 'Notifications',
        params: {username: username},
      });*/
      navigation.navigate('Navigation', {username: username})
      onChangeErrorState('transparent')
    }
    else onChangeErrorState('red');
  }

  return (
    <View style={{ flex:1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{color:'red', fontSize:60, fontWeight:'bold', letterSpacing:-1}}>RedD<Image style={{width:50, height:50}} source={require('./assets/RedDOT-Logo.jpg')}/>t</Text>
      <Text style={{color:'white', fontSize: 16, fontWeight: 'bold',marginBottom: 20}}>Connecting You Always</Text>
      <View style={styles.loginForm}>
        <Text style={{color:'black', fontSize:35, fontWeight:'bold', padding: 20}}>Login</Text>
        <Text style={{color:'black', fontSize:20, fontWeight:'bold', alignSelf: 'left', paddingHorizontal:16, paddingVertical:5}}>Username</Text>
        <TextInput
          style={styles.inputFields}
          autoCapitalize={false}
          autoCorrect={false}
          placeholder={'Enter your username...'}
          onChangeText={onChangeUsername}
          value={username}/>
        <Text style={{color:'black', fontSize:20, fontWeight:'bold', alignSelf: 'left', paddingHorizontal:16, paddingVertical:5}}>Password</Text>
        <TextInput
          style={styles.inputFields}
          placeholder={'Enter your password...'}
          autoCapitalize={false}
          autoCorrect={false}
          onChangeText={onChangePassword}
          value={password}/>
        <Text style={{fontSize: 16, color: errorState, alignSelf: 'left', paddingHorizontal: 16}}>Username or password is incorrect!</Text>
        <TouchableOpacity
          style={{backgroundColor:'dodgerblue', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 10, marginTop: 20, marginBottom: 10}}
          activeOpacity={0.5}
          onPress={verifyUserDetails}>
          <Text style={{color:'white', fontSize: 20, fontWeight: 'bold'}}>Login</Text>
        </TouchableOpacity>
        <Button title={'Cancel'} onPress={() => navigation.goBack()}/>
      </View>
    </View>
  )
}

//Navigation Screen Markup

const Tab = createBottomTabNavigator();

function NavigationScreen({ navigation, route }) {

  const { username } = route.params;

  //FOLLOWING TWO ARE FOR TABBARBADGES, FIX LATER

  //PULL NOTIFICATION NUMBER FROM DATABASE
  const [notificationNumber, updateNotificationNumber] = React.useState(0);

  //PULL CHAT NUMBER FROM DATABASE
  const [chatNumber, updateChatNumber] = React.useState(0);

  return (
      <Tab.Navigator>
        <Tab.Group screenOptions={{ headerShown: false }}>
          <Tab.Screen
            name='Notifications'
            component={NotificationsScreen}
            initialParams={{ username: username }}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name='bell' color={color} size={size} />
              ),
              tabBarBadge: null,
          }}/>
          <Tab.Screen
            name='HomeScreenNavigation'
            component={HomeScreenNavigation}
            initialParams={{ username: username }}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name='home' color={color} size={size} />
              ),
              tabBarBadge: null,
              tabBarLabel: 'Home'
          }}/>
          <Tab.Screen
            name='ChatScreenNavigation'
            component={ChatScreenNavigation}
            initialParams={{ username: username }}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name='chat' color={color} size={size} />
              ),
              tabBarBadge: null,
              tabBarLabel: 'Chats'
          }}/>
          <Tab.Screen
            name='Profile'
            component={ProfileScreen}
            initialParams={{ username: username }}
            options={{
              tabBarIcon: ({ color, size }) => (
                <FontAwesome name='user-circle-o' color={color} size={size} />
              ),
              tabBarBadge: null,
          }}/>
        </Tab.Group>
      </Tab.Navigator>
  )
}

//HomeScreenNavigation Stack
const HomeStack = createNativeStackNavigator();

function HomeScreenNavigation({ navigation, route }) {

  const { username } = route.params;
  
  return (
      <HomeStack.Navigator>
        <HomeStack.Group screenOptions={{ contentStyle:{backgroundColor:'black'}, headerShown: false }}>
          <HomeStack.Screen name='Home' component={HomeScreen} initialParams={{ username: username}}/>
          <HomeStack.Screen name='AddPost' component={AddPostScreen} initialParams={{ username: username}}/>
        </HomeStack.Group>
      </HomeStack.Navigator>
  )
}

//AddPost Markup 
function AddPostScreen({ route, navigation }) {
  
  const { username } = route.params;

  return (
    <View style={{flex:1}}>
      <View style={{flex:1, flexDirection:'row'}}>
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
          <MaterialIcons name='arrow-back-ios' size={30} color='white' onPress={() => navigation.navigate('Home')} />
        </View>
        <View style={{flex:4, alignItems:'center', justifyContent:'center'}}>
          <Text style={{color:'white', fontSize:30, fontWeight:'bold'}}>Create New Post</Text>
        </View>
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
          <MaterialIcons name='post-add' size={30} color='white' onPress={() => navigation.navigate('Home')} />
        </View>
      </View>
      <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
        <TextInput style={{height:'90%', width:'90%', backgroundColor:'white', borderRadius:10, padding:10, fontSize:20}} placeholder='An interesting title...' multiline={true}/>
      </View>
      <View style={{flex:3, alignItems:'center', justifyContent:'center'}}>
        <TextInput style={{height:'90%', width:'90%', backgroundColor:'white', borderRadius:10, padding:10, fontSize:20}} placeholder='A juicy body...' multiline={true}/>
      </View>
    </View>
  )
}

//Home Markup
function HomeScreen({ route, navigation }) {

  const { username } = route.params;

  return (
    <View style={{flex:1, backgroundColor:'black'}}>
      <View style={{flex:4, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
        <View style={{flex:1}}></View>
        <View style={{flex:1, alignItems:'center'}}>
          <Text style={{ color:'white', fontSize:40, fontWeight:'bold'}}>Forum</Text>
        </View>
        <View style={{flex:1, alignItems:'center'}}>
          <TouchableOpacity style={{flexDirection:'row', height:30, width:90, borderRadius:10,backgroundColor:'maroon'}} activeOpacity={0.5} onPress={() => navigation.navigate('AddPost', { usernmae: username})}>
            <View style={{flex:5, alignItems:'center', justifyContent:'center'}}>
              <FontAwesome name='plus-square-o' color='white' size={24} underlayColor='gray'/>
            </View>
            <View style={{flex:6, alignItems:'flex-start', justifyContent:'center'}}>
              <Text style={{color:'white', fontSize:22, fontWeight:'bold'}}>Add</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flex:0.1, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
        <View style={{flex:2, alignItems:'flex-end'}}>
          <TextInput
          style={styles.searchFields}
          placeholder='Search for topics...' />
        </View>
        <View style={{flex:1, alignItems:'center'}}>
          {/* MATCH THE SEARCH TO THE DATABASE, THEN DISPLAY THE RESULT (See 'onPress' prop)*/}
          <TouchableOpacity style={{flexDirection:'row', height:30, width:110, borderRadius:10,backgroundColor:'blue'}} activeOpacity={0.5} onPress={() => alert('hihi')}>
            <View style={{flex:3, alignItems:'center', justifyContent:'center'}}>
              <FontAwesome name='search' color='white' size={20} underlayColor='gray'/>
            </View>
            <View style={{flex:6, alignItems:'flex-start', justifyContent:'center'}}>
              <Text style={{color:'white', fontSize:22, fontWeight:'bold'}}>Search</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flex:12, alignItems:'center', justifyContent:'center'}}></View>
    </View>
    
  )
}

//Notifications Markup
function NotificationsScreen({ route, navigation }) {

  const { username } = route.params;

  const [notificationNumber, updateNotificationNumber] = React.useState(0);

  return (
    <View style={{flex:1}}>
      <View style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'dodgerblue'}}>
        <Image style={{height:100, width: 100, margin:20}}source={require('./assets/default-user-icon.png')}/>
        <Text style={{color:'white', fontSize: 20}}>Welcome back,</Text>
        <Text style={{color:'white', fontSize: 30, fontWeight:'bold'}}>{JSON.stringify(username).replace(/["]+/g, '')}</Text>
      </View>
      <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
        <Text>You have {notificationNumber} new notifications</Text>
      </View>
    </View>
  )
}

//Chat Navigation Stack
const ChatStack = createNativeStackNavigator();

function ChatScreenNavigation({ navigation, route }) {

  const { username } = route.params;
  
  return (
      <ChatStack.Navigator>
        <ChatStack.Group screenOptions={{ contentStyle:{backgroundColor:'black'}, headerShown: false }}>
          <ChatStack.Screen name='Chats' component={ChatScreen} initialParams={{ username: username}}/>
          <ChatStack.Screen name='ChatRoom' component={ChatRoomScreen} initialParams={{ username: username}}/>
        </ChatStack.Group>
      </ChatStack.Navigator>
  )
}

//Chats Markup
function ChatScreen({ navigation }) {
  return (
    <View style={{flex:1}}>
      <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
        <Text style={{color:'white', fontSize:30, fontWeight:'bold'}}>Chats</Text>
      </View>
      <View style={{flex:5, alignItems:'flex-start', alignItems:'center'}}>
        {/* PSEUDO CHAT, TO BE REPLACED WITH REAL DATA LATER */}
        <TouchableOpacity style={styles.chatBox} onPress={() => navigation.navigate('ChatRoom')}>
          <Image style={{height:30, width:30}} source={require('./assets/default-user-icon.png')}/>
          <Text style={{color:'white', fontSize:20, fontWeight:'bold'}}>John Smith</Text>
        </TouchableOpacity>
      </View>
    </View>
    
  )
}

//ChatRoom Markup
function ChatRoomScreen({ navigation }) {
  return (
    <View style={{flex:1}}>
      <View style={{flex:0.6, flexDirection:'row'}}>
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
          <MaterialIcons name='arrow-back-ios' size={30} color='white' onPress={() => navigation.navigate('Chats')} />
        </View>
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
          <Image style={{height:30, width:30}} source={require('./assets/default-user-icon.png')}/>
        </View>
        <View style={{flex:8, alignItems:'flex-start', justifyContent:'center'}}>
          <Text style={{color:'white', fontSize:30, fontWeight:'bold'}}>John Smith</Text>
        </View>
      </View>
      <View style={{flex:2}}></View>
      <View style={{flex:0.2, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
        <View style={{flex:2, alignItems:'flex-end'}}>
          <TextInput
          style={styles.searchFields}
          />
        </View>
        <View style={{flex:0.3, alignItems:'center'}}>
          <TouchableOpacity style={{backgroundColor:'blue', height:30, width:30, borderRadius:10, alignItems:'center', justifyContent:'center'}}>
            {/* SEND THE MSG TO THE DATABASE, THEN REFRESH TO DISPLAY THE MESSAGE (See 'onPress' prop)*/}
            <MaterialCommunityIcons name='send' color='white' size={20} underlayColor='gray'/>
          </TouchableOpacity>
        </View>
        
      </View>
    </View>
  )
}

//Profile Markup
function ProfileScreen() {
  return (
    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
      <Text>This is the Profile page</Text>
    </View>
  )
}

//Main App.js Stack
const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Group screenOptions={{ contentStyle:{backgroundColor:'black'}, headerShown: false }}>
          <Stack.Screen name='Welcome' component={WelcomeScreen} />
          <Stack.Screen name='Login' component={LoginScreen} />
          <Stack.Screen name='Navigation' component={NavigationScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeButtons: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 40,
    margin: 10,
    width: '60%',
    height: '8%',
    borderRadius: '10%',
    justifyContent: 'center',
  },
  welcomeButtonText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 30,
  },
  loginForm: {
    height: '45%',
    width: '80%',
    backgroundColor: 'white',
    borderRadius: '20%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputFields: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'lightgray',
    width: '90%',
    height: '8%',
    fontSize: 20,
    padding: 4,
    marginBottom: 15
  },
  searchFields: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'lightgray',
    backgroundColor: 'white',
    width: '92%',
    height: 30,
    fontSize: 20,
    padding: 4,
  },
  chatBox: {
    width: '90%',
    height: 50,
    flexDirection: 'row',
    alignItems:'center'
  }
});
