import LoginScreen from '@/components/login';
import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthProvider } from '../_layout';
import ProductInsertScreen from '@/components/ProductInsert';
import { FontAwesome } from '@expo/vector-icons';

const Dashboard = () => {
  const {data,logoutFun} = useContext<any>(AuthProvider)
  return (
    <ScrollView className="flex-1">
     {data?._id&&<View className="p-4 bg-white mb-1 flex flex-row justify-between">
        <View className="flex flex-row items-center space-x-2">
          <FontAwesome name='user-circle' size={35} />
          <View>
            <Text className="text-xl">{data?.name}</Text>
            <Text className="text-gray-500">{data?.role}</Text>
          </View>
        </View>  
        <TouchableOpacity onPress={()=>logoutFun()}>
          <Text className="text-lg text-red-500">Logout</Text>
        </TouchableOpacity>  
      </View>}
      {!data&&<LoginScreen/>}
      {data&&<ProductInsertScreen/>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({})

export default Dashboard;
