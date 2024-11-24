import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

interface HeaderProps {
    title: string;
    subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
    return (
      <View style={styles.header}>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <Text style={styles.title}>{title}</Text>
      </View>
    )
}

const styles = StyleSheet.create({
    header: {
      padding: 16,
      paddingTop: 55,
    },
    subtitle: {
      fontSize: 20,
      fontWeight: '600',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginTop: 4,
      }
    })