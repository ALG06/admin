import { Stack, Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: 'black',
            position: 'absolute',
          },
          default: {
            backgroundColor: 'light',
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <IconSymbol 
              size={28} 
              name="house.fill" 
              color={focused ? 'grey' : 'white'} // Change color when focused
            />
          ),
          tabBarLabelStyle: { color: 'white' },
        }}
      />
      <Tabs.Screen
        name="donations"
        options={{
          title: 'Donaciones',
          tabBarIcon: ({ focused }) => (
            <AntDesign 
              name="heart" 
              size={24} 
              color={focused ? 'grey' : 'white'} // Change color when focused
            />
          ),
          tabBarLabelStyle: { color: 'white' },
        }}
      />
      <Tabs.Screen
        name="campaigns"
        options={{
          title: 'Campañas',
          tabBarIcon: ({ focused }) => (
            <MaterialIcons 
              name="campaign" 
              size={24} 
              color={focused ? 'grey' : 'white'} // Change color when focused
            />
          ),
          tabBarLabelStyle: { color: 'white' },
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="donation-points/index"
        options={{
          title: 'Puntos',
          tabBarIcon: ({ focused }) => (
            <Entypo 
              name="location-pin" 
              size={24} 
              color={focused ? 'grey' : 'white'} // Change color when focused
            />
          ),
          tabBarLabelStyle: { color: 'white' },
        }}
      />
      <Tabs.Screen
        name="qr-scanner/index"
        options={{
          title: 'QR',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons 
              name="qrcode-scan" 
              size={24} 
              color={focused ? 'grey' : 'white'} // Change color when focused
            />
          ),
          tabBarLabelStyle: { color: 'white' },
        }}
      />
    </Tabs>
  );
}
