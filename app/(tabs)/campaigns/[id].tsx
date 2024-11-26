import { View, Text, Button, StyleSheet, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';

type Campaign = {
  id: number;
  name: string;
  address: string;
  description: string;
  start_date: string;
  end_date: string;
  active: boolean;
  lat: number;
  lon: number;
};

export default function DetailedCampaign() {
  const { id } = useLocalSearchParams(); // Get the campaign ID from the route
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCampaignDetails();
  }, [id]);

  const baseURL = Platform.OS === 'ios' ? 'http://127.0.0.1:5000' : 'http://10.0.2.2:5000';
  const fetchCampaignDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseURL}/campaigns/list?id=${id}`);
      setCampaign(response.data[0]); // Assuming the API returns a single campaign object
      setError(null);
    } catch (err) {
      console.error('Error fetching campaign details:', err);
      setError('Failed to load campaign details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    alert('Edit functionality goes here!');
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${baseURL}/campaigns/delete?id=${id}`);
      router.push('../'); // Redirect to the campaign list after deletion
    } catch (err) {
      console.error('Error deleting campaign:', err);
      alert('Failed to delete campaign');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Reintentar" onPress={fetchCampaignDetails} />
      </View>
    );
  }

  if (!campaign) {
    return (
      <View style={styles.container}>
        <Text>No campaign data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{campaign.name}</Text>
      <Text style={styles.details}>{campaign.description}</Text>
      <Text style={styles.details}>Dirección: {campaign.address}</Text>
      <Text style={styles.details}>Fecha de inicio: {new Date(campaign.start_date).toLocaleDateString()}</Text>
      <Text style={styles.details}>Fecha de fin: {new Date(campaign.end_date).toLocaleDateString()}</Text>
      <Text style={styles.details}>Estado: {campaign.active ? 'Activo' : 'Inactivo'}</Text>
      <View style={styles.buttons}>
        <Button title="Editar" onPress={handleEdit} />
        <Button title="Eliminar" onPress={handleDelete} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  details: { fontSize: 16, marginBottom: 5 },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});