import { View, StyleSheet } from 'react-native';
import React from 'react';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header title="Home" subtitle="Punto donativo" />
      
      <View style={styles.content}>
        <Button 
          mode="contained" 
          style={styles.button}
          onPress={() => router.push('/campaigns')}
        >
          Campaigns
        </Button>

        <Button 
          mode="contained"
          style={styles.button}
          onPress={() => router.push('/donations')}
        >
          Donations
        </Button>

        <Button 
          mode="contained"
          style={styles.button}
          onPress={() => router.push('/qr-scanner')}
        >
          QR Scanner
        </Button>
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
  button: {
    marginBottom: 8
  }
});