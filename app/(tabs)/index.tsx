import { View, StyleSheet } from 'react-native';
import React from 'react';
import { Button, Surface, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';

type AppRoute = '/(tabs)/campaigns' | '/(tabs)/donations' | '/(tabs)/qr-scanner';

interface Section {
  title: string;
  description: string;
  route: AppRoute;
}

export default function Home() {
  const router = useRouter();

  const sections: Section[] = [
    {
      title: 'Campaigns',
      description: 'View and manage active donation campaigns',
      route: '/(tabs)/campaigns'
    },
    {
      title: 'Donations',
      description: 'Track donations and view donation history',
      route: '/(tabs)/donations'
    },
    {
      title: 'QR Scanner',
      description: 'Quickly scan QR codes for donation processing',
      route: '/(tabs)/qr-scanner'
    }
  ];

  return (
    <View style={styles.container}>
      <Header title="Home" subtitle="Punto donativo" />

      <View style={styles.content}>
        {sections.map((section, index) => (
          <Surface key={index} style={styles.surface} elevation={1}>
            <Text variant="titleMedium" style={styles.title}>
              {section.title}
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              {section.description}
            </Text>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => router.push(section.route)}
            >
              Go to {section.title}
            </Button>
          </Surface>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  content: {
    padding: 16,
    gap: 16
  },
  surface: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff'
  },
  title: {
    marginBottom: 8,
    fontWeight: '500'
  },
  description: {
    marginBottom: 16,
    color: '#666666'
  },
  button: {
    marginTop: 'auto'
  }
});
