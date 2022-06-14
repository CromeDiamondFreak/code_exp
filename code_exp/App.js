// DUMMY DATA:

const dummyUser1 = {
  username: 'janesmith2022',
  password: 'Dsta@2022',
  realName: 'Jane Smith',
  chats: ['Ashish Chugh'],
  posts: ['[National Service] When is my next NS reservist cycle?', 'How likely will Singapore increase her security alert?'],
  comments: [],
  connections: [dummyUser2, dummyUser3],
  unit: 'SPF PROCOM',
  vocation: 'DXO',
  occupation: 'Software Engineer',
  organisation: 'Google Inc.'
}

const dummyUser2 = {
  username: 'ashishchugh2022',
  password: 'Dsta@2022',
  realName: 'Ashish Chugh',
  chats: [],
  posts: ['I need food... lunch anyone?', '[National Service] NS Matters'],
  connections: [dummyUser1, dummyUser3],
  unit: '10 C4I',
  vocation: 'Signal Operator',
  occupation: 'Data Analyst',
  organisation: 'LittleLives Pte. Ltd.'
}

const dummyUser3 = {
  username: 'henrykhoo2022',
  password: 'Dsta@2022',
  realName: 'Henry Khoo',
  chats: [],
  connections: [dummyUser2, dummyUser1],
  unit: '21SA',
  vocation: 'Security Trooper',
  occupation: 'Accountant',
  organisation: 'KPMG'
} 

const users = [dummyUser1, dummyUser2, dummyUser3];

const forumPost1 = {
  author: dummyUser1,
  title: 'When will my next NS reservist be?',
  body: ''
}

const forumPost2 = {
  author: dummyUser2,
  title: 'How likely will Singapore increase security alert?',
  body: ''
}

//const forumPosts = [forumPost1, forumPost2];
const forumPosts = ['title1', 'title2'];

import { db } from "./firebase-config";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, } from "firebase/firestore";

import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { TouchableOpacity, Image, StyleSheet, Text, View, Button, TextInput, KeyboardAvoidingView } from 'react-native';

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
    // 'users' (see const above) refers to a dummy array containing all the dummy users
    for(let i = 0 ; i < users.length ; i++) {
      if(users[i].username == username) {
        if(users[i].password == password) {
          navigation.navigate('Navigation', {userData: users[i]})
          onChangeErrorState('transparent')
        }
      }
      else onChangeErrorState('red');
    }
    
  }

  return (
    <View style={{ flex:1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{color:'red', fontSize:60, fontWeight:'bold', letterSpacing:-1}}>RedD<Image style={{width:50, height:50}} source={require('./assets/RedDOT-Logo.jpg')}/>t</Text>
      <Text style={{color:'white', fontSize: 16, fontWeight: 'bold',marginBottom: 20}}>Connecting You Always</Text>
      <View style={styles.loginForm}>
        <Text style={{color:'black', fontSize:35, fontWeight:'bold', padding: 20}}>Login</Text>
        <Text style={{color:'black', fontSize:20, fontWeight:'bold', alignSelf: 'flex-start', paddingHorizontal:16, paddingVertical:5}}>Username</Text>
        <TextInput
          style={styles.inputFields}
          autoCapitalize={false}
          autoCorrect={false}
          placeholder={'Enter your username...'}
          onChangeText={onChangeUsername}
          value={username}/>
        <Text style={{color:'black', fontSize:20, fontWeight:'bold', alignSelf: 'flex-start', paddingHorizontal:16, paddingVertical:5}}>Password</Text>
        <TextInput
          style={styles.inputFields}
          placeholder={'Enter your password...'}
          autoCapitalize={false}
          autoCorrect={false}
          onChangeText={onChangePassword}
          value={password}/>
        <Text style={{fontSize: 16, color: errorState, alignSelf: 'flex-start', paddingHorizontal: 16}}>Username or password is incorrect!</Text>
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

  const { userData } = route.params;

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
            initialParams={{ userData: userData }}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name='bell' color={color} size={size} />
              ),
              tabBarBadge: null,
          }}/>
          <Tab.Screen
            name='HomeScreenNavigation'
            component={HomeScreenNavigation}
            initialParams={{ userData: userData }}
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
            initialParams={{ userData: userData }}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name='chat' color={color} size={size} />
              ),
              tabBarBadge: null,
              tabBarLabel: 'Chats'
          }}/>
          <Tab.Screen
            name='ProfileScreenNavigation'
            component={ProfileScreenNavigation}
            initialParams={{ userData: userData }}
            options={{
              tabBarIcon: ({ color, size }) => (
                <FontAwesome name='user-circle-o' color={color} size={size} />
              ),
              tabBarBadge: null,
              tabBarLabel: 'Profile'
          }}/>
        </Tab.Group>
      </Tab.Navigator>
  )
}

//HomeScreenNavigation Stack
const HomeStack = createNativeStackNavigator();

function HomeScreenNavigation({ navigation, route }) {

  const { userData } = route.params;
  
  return (
      <HomeStack.Navigator>
        <HomeStack.Group screenOptions={{ contentStyle:{backgroundColor:'black'}, headerShown: false }}>
          <HomeStack.Screen name='Home' component={HomeScreen} initialParams={{ userData: userData }}/>
          <HomeStack.Screen name='AddPost' component={AddPostScreen} initialParams={{ userData: userData }}/>
        </HomeStack.Group>
      </HomeStack.Navigator>
  )
}

const addPost = async (id, newpost) => {
  const userDoc = doc(db,"users",id);
  const newFields = { posts : {...userData.posts,newpost}}
  await updateDoc(userDoc,newFields);
}

//AddPost Markup 
function AddPostScreen({ route, navigation }) {
  
  const { username } = route.params;

  //PSEUDO CODE (HARDCODED)
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

  function ForumPosts() {
    //PSEUDO DATA FOR SS PURPOSES
    return (
      <View style={{width:'100%'}}>
        <View style={styles.chatBox} >
          {/* PSEUDO CHAT, TO BE REPLACED WITH REAL DATA LATER */}
          <TouchableOpacity onPress={() => alert('Feature under development')}>
            <Text style={{color:'white', fontSize:20, fontWeight:'bold'}}>[National Service] When will my next NS reservist be?</Text>
            <View style={{flexDirection:'row', alignItems:'center', marginVertical:5}}>
              <Image style={{height:20, width:20}} source={require('./assets/default-user-icon.png')}/>
              <Text style={{color:'white', marginHorizontal:5}}>James Sin</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.chatBox} >
          {/* PSEUDO CHAT, TO BE REPLACED WITH REAL DATA LATER */}
          <TouchableOpacity onPress={() => alert('Feature under development')}>
            <Text style={{color:'white', fontSize:20, fontWeight:'bold'}}>Anybody free for coffee tomorrow?</Text>
            <View style={{flexDirection:'row', alignItems:'center', marginVertical:5}}>
              <Image style={{height:20, width:20}} source={require('./assets/default-user-icon.png')}/>
              <Text style={{color:'white', marginHorizontal:5}}>Ashish Chugh</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.chatBox} >
          {/* PSEUDO CHAT, TO BE REPLACED WITH REAL DATA LATER */}
          <TouchableOpacity onPress={() => alert('Feature under development')}>
            <Text style={{color:'white', fontSize:20, fontWeight:'bold'}}>[National Service] How likely will Singapore increase her security alert?</Text>
            <View style={{flexDirection:'row', alignItems:'center', marginVertical:5}}>
              <Image style={{height:20, width:20}} source={require('./assets/default-user-icon.png')}/>
              <Text style={{color:'white', marginHorizontal:5}}>Henry Khoo</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.chatBox} >
          {/* PSEUDO CHAT, TO BE REPLACED WITH REAL DATA LATER */}
          <TouchableOpacity onPress={() => alert('Feature under development')}>
            <Text style={{color:'white', fontSize:20, fontWeight:'bold'}}>[National Service] What should I expect for my upcoming reservist cycle?</Text>
            <View style={{flexDirection:'row', alignItems:'center', marginVertical:5}}>
              <Image style={{height:20, width:20}} source={require('./assets/default-user-icon.png')}/>
              <Text style={{color:'white', marginHorizontal:5}}>Tang Zuqing</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      
      
    )
  }

  return (
    <View style={{flex:1, backgroundColor:'black', alignItems:'center'}}>
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
      <View style={{flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
        <View style={{flex:2, alignItems:'flex-end'}}>
          <TextInput
          style={styles.searchFields}
          placeholder='Search for topics...' />
        </View>
        <View style={{flex:1, alignItems:'center'}}>
          {/* MATCH THE SEARCH TO THE DATABASE, THEN DISPLAY THE RESULT (See 'onPress' prop)*/}
          <TouchableOpacity style={{flexDirection:'row', height:30, width:110, borderRadius:10,backgroundColor:'blue'}} activeOpacity={0.5} onPress={() => alert('Feature under Development')}>
            <View style={{flex:3, alignItems:'center', justifyContent:'center'}}>
              <FontAwesome name='search' color='white' size={20} underlayColor='gray'/>
            </View>
            <View style={{flex:6, alignItems:'flex-start', justifyContent:'center'}}>
              <Text style={{color:'white', fontSize:22, fontWeight:'bold'}}>Search</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flex:10, alignItems:'center', justifyContent:'flex-start', backgroundColor:'#202020', borderRadius:10, width:'93%', marginBottom:10, padding: 10}}>
        <ForumPosts></ForumPosts>
      </View>
    </View>
    
  )
}

//Notifications Markup
function NotificationsScreen({ route, navigation }) {

  const { userData } = route.params;

  const [notificationNumber, updateNotificationNumber] = React.useState(0);

  return (
    <View style={{flex:1}}>
      <View style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'dodgerblue'}}>
        <Image style={{height:100, width: 100, margin:20}}source={require('./assets/default-user-icon.png')}/>
        <Text style={{color:'white', fontSize: 20}}>Welcome back,</Text>
        <Text style={{color:'white', fontSize: 30, fontWeight:'bold'}}>{JSON.stringify(userData.realName).replace(/["]+/g, '')}</Text>
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

  const { userData } = route.params;
  
  return (
      <ChatStack.Navigator>
        <ChatStack.Group screenOptions={{ contentStyle:{backgroundColor:'black'}, headerShown:false}}>
          <ChatStack.Screen
            name='Chats'
            component={ChatScreen}
            initialParams={{ userData: userData }}/>
          <ChatStack.Screen
            name='ChatRoom'
            component={ChatRoomScreen}
            options={({ route }) => ({ title: route.params.targetName })}
            initialParams={{ userData: userData }}/>
        </ChatStack.Group>
      </ChatStack.Navigator>
  )
}

//Chats Markup
function ChatScreen({ navigation, route }) {

  const { userData } = route.params;

  function ChatBox() {
    return (
      <View>
        {userData.chats.map((user, index) => (
            <View style={{alignItems:'flex-start', alignItems:'center'}}>
              {/* PSEUDO CHAT, TO BE REPLACED WITH REAL DATA LATER */}
              <TouchableOpacity style={styles.chatBox} onPress={() => navigation.navigate('ChatRoom')}>
                <Image style={{height:30, width:30}} source={require('./assets/default-user-icon.png')}/>
                <Text style={{color:'white', fontSize:20, fontWeight:'bold'}} key={index}>{user}</Text>
              </TouchableOpacity>
            </View>
        ))}
      </View>
    )
  }

  return (
    <View style={{flex:1}}>
      <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
        <Text style={{color:'white', fontSize:30, fontWeight:'bold'}}>Chats</Text>
      </View>
      <View style={{flex:5}}>
        <ChatBox></ChatBox>
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
          <Text style={{color:'white', fontSize:30, fontWeight:'bold'}}>Ashish Chugh</Text>
        </View>
        <View ></View>
      </View>
      <View style={{flex:2, alignItems:'center'}}>
        <View style={{backgroundColor:'#202020', width:'93%', height:40, padding:10, borderRadius:8, marginBottom:10}}>
          <Text style={{color:'white'}} >Hey bro! Do you remember me?</Text>
        </View>
        <View style={{backgroundColor:'maroon', width:'93%', height:40, padding:10, borderRadius:8, marginBottom:10}}>
          <Text style={{color:'white'}} >Of course bro how can don't remember you!</Text>
        </View>
        <View style={{backgroundColor:'#202020', width:'93%', height:40, padding:10, borderRadius:8, marginBottom:10}}>
          <Text style={{color:'white'}} >Nice la meet sometime?</Text>
        </View>
        <View style={{backgroundColor:'maroon', width:'93%', height:40, padding:10, borderRadius:8, marginBottom:10}}>
          <Text style={{color:'white'}} >Ok sure!</Text>
        </View>
      </View>
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

//Profile Navigator Stack
const ProfileStack = createNativeStackNavigator();

function ProfileScreenNavigation({ navigation, route }) {

  const { userData } = route.params;
  
  return (
      <ProfileStack.Navigator>
        <ProfileStack.Group screenOptions={{ headerShown: false }}>
          <ProfileStack.Screen name='Profile' component={ProfileScreen} initialParams={{ userData: userData }}/>
          <ProfileStack.Screen name='ProfileSettings' component={ProfileSettingsScreen} initialParams={{ userData: userData }}/>
        </ProfileStack.Group>
      </ProfileStack.Navigator>
  )
}

//Profile Markup
function ProfileScreen({ route, navigation }) {
  
  const { userData } = route.params;

  const [dataType, updateDataType] = React.useState('post');
  const [postColor, updatePostColor] = React.useState('dodgerblue');
  const [commentColor, updateCommentColor] = React.useState('white');
  const [postThickness, updatePostThickness] = React.useState('bold');
  const [commentThickness, updateCommentThickness] = React.useState('normal');

  function PostBox() {

    

    if(dataType == 'post') {
      if(userData.posts.length == 0) {
        return (
          <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Text style={{color:'gray', fontSize:20}}>Wow, such empty</Text>
          </View>
        )
      }
      return (
        <View>
          {userData.posts.map((post, index) => (
              <View style={{alignItems:'flex-start', justifyContent:'center'}}>
                {/* PSEUDO CHAT, TO BE REPLACED WITH REAL DATA LATER */}
                <TouchableOpacity style={styles.postBox} onPress={() => alert('Feature under development.')}>
                  <Text style={{color:'white', fontSize:20}} key={index}>{post}</Text>
                  <View style={{flexDirection:'row', alignSelf:'flex-end'}}>
                    <MaterialIcons name='arrow-upward' size={15} color='white' />
                    <Text style={{color:'white', marginLeft:5, marginRight:10}}>12</Text>
                    <MaterialCommunityIcons name='comment-outline' size={15} color='white' />
                    <Text style={{color:'white', marginLeft:5}}>5</Text>
                  </View>
                </TouchableOpacity>
              </View>
          ))}
        </View>
      )
    } else {
      if(userData.comments.length == 0) {
        return (
          <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Text style={{color:'gray', fontSize:20}}>Wow, such empty</Text>
          </View>
        )
      }
      return (
        <View>
          {userData.comments.map((post, index) => (
              <View style={{alignItems:'flex-start', justifyContent:'center'}}>
                {/* PSEUDO CHAT, TO BE REPLACED WITH REAL DATA LATER */}
                <TouchableOpacity style={styles.postBox} onPress={() => alert('Feature under development.')}>
                  <Text style={{color:'white', fontSize:20}} key={index}>{post}</Text>
                  <View style={{flexDirection:'row', alignSelf:'flex-end'}}>
                    <MaterialIcons name='arrow-upward' size={15} color='white' />
                    <Text style={{color:'white', marginLeft:5, marginRight:10}}>12</Text>
                    <MaterialCommunityIcons name='comment-outline' size={15} color='white' />
                    <Text style={{color:'white', marginLeft:5}}>5</Text>
                  </View>
                </TouchableOpacity>
              </View>
          ))}
        </View>
      )
    }

    
    
  }

  return (
    <View style={{flex:1, backgroundColor:'black', alignItems:'center'}}>
      <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
        <Image style={{height:50, width:50}} source={require('./assets/default-user-icon.png')}/>
        <Text style={{color:'white', fontSize:30, fontWeight:'bold', padding:10}}>{userData.realName}</Text>
      </View>
      <View style={{flex:0.5, flexDirection:'row', alignContent:'center', justifyContent:'center'}}>
        <View style={{flex:4, alignItems:'center', justifyContent:'center'}}>
          <View style={{flexDirection:'row', height:30, width:'90%', backgroundColor:'red', alignItems:'center', justifyContent:'center', borderRadius:10}}>
            <FontAwesome name='users' size={20} color='white' />
            <Text style={{fontSize:20, color:'white'}}>  {JSON.stringify(userData.connections.length)} Connections</Text>
          </View>
        </View>
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
          <MaterialIcons name='settings' size={30} color='white' onPress={() => navigation.navigate('ProfileSettings')} />
        </View>
      </View>
      <View style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'#202020', borderRadius:10, width:'93%'}}>
        <View style={{flex:1, flexDirection:'row'}}>
          <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <FontAwesome name='id-badge' size={30} color='white' />
          </View>
          <View style={{flex:4, alignItems:'flex-start', justifyContent:'center'}}>
            <Text style={{color:'white'}}>{userData.unit}</Text>
            <Text style={{color:'white'}}>{userData.vocation}</Text>
          </View>
        </View>
        <View style={{flex:1, flexDirection:'row'}}>
          <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <MaterialIcons name='work' size={30} color='white' />
          </View>
          <View style={{flex:4, alignItems:'flex-start', justifyContent:'center'}}>
            <Text style={{color:'white'}}>{userData.organisation}</Text>
            <Text style={{color:'white'}}>{userData.occupation}</Text>
          </View>
        </View>
      </View>
      <View style={{flex:3, alignItems:'center', justifyContent:'center', width:'100%'}}>
        <View style={{flex:1, flexDirection:'row', backgroundColor:'#202020', width:'93%', borderRadius:10, margin:10, padding:10}}>
          <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <MaterialIcons
              name={'article'}
              size={40}
              color={postColor}
              onPress={() => {
                if(dataType == 'post') return;
                updateDataType('post');
                updateCommentColor('white');
                updateCommentThickness('normal');
                updatePostColor('dodgerblue');
                updatePostThickness('bold');
              }} />
            <Text style={{color:postColor, fontSize:20, fontWeight:postThickness, padding:5}}>Posts</Text>
          </View>
          <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <MaterialIcons
              name={'comment'}
              size={40}
              color={commentColor}
              onPress={() => {
                if(dataType == 'comment') return;
                updateDataType('comment');
                updateCommentColor('dodgerblue');
                updateCommentThickness('bold');
                updatePostColor('white');
                updatePostThickness('normal');
              }} />
            <Text style={{color:commentColor, fontSize:20, fontWeight:commentThickness, padding:5}}>Comments</Text>
          </View>
        </View>
        <View style={{flex:3, backgroundColor:'#202020', width:'93%', borderRadius:10, marginBottom:20}}>
          <PostBox></PostBox>
        </View>
      </View>
    </View>
  )
}


//   onclick/ onPress will trigger updateProfile 
const updateProfile = async (userData,newUnit,newVocation,newOccupation,newOrganisation) => {
  const userDoc = doc(db,"users",userData.id);

  const newFields = { 
    unit : newUnit,
    vocation : newVocation,
    occupation : newOccupation,
    organisation : newOrganisation}

  await updateDoc(userDoc,newFields);

}

//ProfileSettings Markup
function ProfileSettingsScreen({ route, navigation }) {

  const { userData } = route.params;

  return (
    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
      <Text>This is the Profile Settings page</Text>
    </View>
  )
}

//Main App.js Stack
const Stack = createNativeStackNavigator();

function App() {
  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db,"users");

  useEffect( ()=> {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(),id: doc.id})));
    };

    getUsers();
  }, [])
  
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
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems:'center',
    backgroundColor: '#101010'
  },
  postBox: {
    width: '97%',
    padding: 10,
    margin: 5,
  }
});
