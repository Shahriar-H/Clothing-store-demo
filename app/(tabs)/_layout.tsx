import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Icon from 'react-native-vector-icons/FontAwesome';

interface tabLayoutProps  {
  showTabs : boolean
}

export default function TabLayout() {
  const colorScheme = 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor:Colors[colorScheme ?? 'light'].tint ,
        headerShown: false,
        tabBarStyle:{backgroundColor:'white',paddingTop:4     }
      }}  >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }} 
      />
     
       <Tabs.Screen
        name="explore"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'bag-handle' : 'bag-handle-outline'} color={color} />
            
          ),
        }}
      />
       <Tabs.Screen
        name="dashboard"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'grid' : 'grid-outline'} color={color} />
            
          ),
        }}
      />
      
    </Tabs>
  ) ;
}
