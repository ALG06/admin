import { View, Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

interface HeaderProps {
    title: string;
    subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
    const navigation = useNavigation();
    const route = useRoute();

    // Determine if the current route is the initial route
    const isInitialRoute = route.name === 'index' || route.name === 'donations/index' || route.name === 'donation-points/index';
    console.log(route.name)

    return (
      <View style={styles.header}>
          {!isInitialRoute && (
            <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                <MaterialIcons name="arrow-back" size={24} color="#000" />
            </Pressable>
          )}
          <View style={styles.textContainer}>
              <Text style={styles.subtitle}>{subtitle}</Text>
              <Text style={styles.title}>{title}</Text>
          </View>
      </View>
    );
}

const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      paddingTop: 55,
      backgroundColor: '#fff',
    },
    backButton: {
      marginRight: 16,
    },
    textContainer: {
      flex: 1,
    },
    subtitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#000',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginTop: 4,
        color: '#000',
    }
});