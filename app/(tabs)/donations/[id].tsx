import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function DonationDetail() {
  const { id } = useLocalSearchParams();
  const [donationDetails, setDonationDetails] = useState<CompleteDonation | null>(null);
  const [loading, setLoading] = useState(true);

  const baseURL = Platform.OS === 'ios' ? 'http://192.168.68.102:5000' : 'http://10.0.2.2:5000';


  useEffect(() => {
    const fetchDonationDetails = async () => {
      try {
        console.log('Fetching from:', `${baseURL}/donations/details/${id}`);
        const response = await fetch(`${baseURL}/donations/details/${id}`);
        const data = await response.json();
        console.log('Response:', data);
        setDonationDetails(data);
      } catch (error) {
        console.error('Full error:', error);
      }
    };

    if (id) fetchDonationDetails();
    console.log(donationDetails)
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#EC4899" />
        <Text>Loading donation details...</Text>
      </View>
    );
  }

  if (!donationDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load donation details.</Text>
      </View>
    );
  }

  const {donation, donor, food_items, total_food_items } = donationDetails;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Detalles de la donación</Text>
      <Text style={styles.text}>ID: {donation.id}</Text>
      <Text style={styles.text}>Tipo: {donation.type || 'N/A'}</Text>
      <Text style={styles.text}>
        Fecha: {new Date(donation.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}
      </Text>
      <Text style={styles.text}>Tiempo: {donation.time.split(':').slice(0, 2).join(':')}</Text>
      <Text style={styles.text}>Estatus: {donation.pending ? 'Pendiente' : 'Completada'}</Text>

      <Text style={styles.sectionTitle}>Información del donante</Text>
      {donor && donor.length > 0 ? (
        donor.map((d, index) => (
          <View key={index} style={styles.donorCard}>
            <Text style={styles.text}>Nombre: {d.name}</Text>
            <Text style={styles.text}>Email: {d.email}</Text>
            <Text style={styles.text}>Número de Teléfono: {d.phone}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.text}>No donor information available.</Text>
      )}

      <Text style={styles.sectionTitle}>Alimentos</Text>
      {total_food_items > 0 ? (
        food_items.map((item, index) => (
          <View key={index} style={styles.foodCard}>
            <Text style={styles.text}>Categoria: {item.category || 'N/A'}</Text>
            <Text style={styles.text}>Cantidad: {item.quantity || 'N/A'}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.text}>No food items donated.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: 'black',
  },
  donorCard: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  foodCard: {
    backgroundColor: '#f4f4f4',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 16,
  },
});
