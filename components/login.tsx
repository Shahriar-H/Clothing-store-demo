import { AuthProvider } from "@/app/_layout";
import { apiUrl } from "@/assets/lib";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Alert, ToastAndroid } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {data,loginFun} = useContext<any>(AuthProvider)

  const storeData = async (value:Object) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('login', jsonValue);
    } catch (e) {
      // saving error
      console.log(e);
      
    }
  };

  const handleLogin = () => {
    if (email && password) {
        fetch(apiUrl+"/get-item",{
            method:"POST",
            headers:{
            "Content-Type":"application/json"
            },
            body: JSON.stringify({table:"users", query:{email:email,password:password}})
        })
        .then(response => response.json())
        .then(data => {
        console.log(data);
        if(data?.result[0]){
            storeData(data?.result[0])
            loginFun(data?.result[0])
        }else{
            return ToastAndroid.show("Wrong Info",ToastAndroid.SHORT)
        }
        })
    } else {
      Alert.alert("Error", "Please enter both email and password.");
    }
  };

  const userinstance = (user:string)=>{
    if(user==='admin'){
        setEmail("shakisk23@gmail.com")
        setPassword('1111')
    }else{
        setEmail("shaki@gmail.com")
        setPassword('123456')
    }
  }

  return (
    <SafeAreaView className=" bg-gray-100 mt-10">
      <View className=" justify-center items-center px-6">
        {/* Title */}
        <Text className="text-3xl font-bold text-gray-800 mb-6">Login</Text>

        {/* Email Input */}
        <TextInput
          placeholder="Email"
          className="w-full p-4 mb-4 border rounded-lg bg-white border-gray-300 text-gray-800"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        {/* Password Input */}
        <TextInput
          placeholder="Password"
          className="w-full p-4 mb-4 border rounded-lg bg-white border-gray-300 text-gray-800"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          className="w-full bg-blue-500 p-4 rounded-lg"
        >
          <Text className="text-white text-center font-bold">Login</Text>
        </TouchableOpacity>

        <View className="flex flex-row mt-5">
            <TouchableOpacity onPress={()=>userinstance('admin')} className="p-3 px-5 rounded m-2 bg-indigo-600">
                <Text className="text-white">As Admin</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>userinstance('user')} className="p-3 px-5 rounded m-2 bg-amber-600">
                <Text className="text-white">As User</Text>
            </TouchableOpacity>
        </View>

        
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
