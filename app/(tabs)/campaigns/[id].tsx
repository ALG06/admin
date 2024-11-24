import { View, Text, Button, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

type Campaign = {
  id: number; // Assuming id is a number
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;
  description: string;
  date: string; // Assuming date is a string in ISO format
  schedule: string;
  status: string;
  capacity: string;
};

export default function DetailedCampaign() {
  const { id } = useLocalSearchParams(); // Get the campaign ID from the route
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Simulate fetching campaign details
    const fetchCampaign = async () => {
      const data = require('./campaigns.json'); // Mock data
      const selectedCampaign = data.find((c: Campaign) => c.id === parseInt(id as string, 10));
      setCampaign(selectedCampaign);
    };
    fetchCampaign();
  }, [id]);

  if (!campaign) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleEdit = () => {
    alert('Edit functionality goes here!');
  };

  const handleDelete = () => {
    alert('Delete functionality goes here!');
    router.push('../'); // Redirect to the campaign list after deletion
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{campaign.name}</Text>
      <Text style={styles.details}>{campaign.description}</Text>
      <Text style={styles.details}>Location: {campaign.address}</Text>
      <Text style={styles.details}>Date: {campaign.date}</Text>
      <Text style={styles.details}>Schedule: {campaign.schedule}</Text>
      <Text style={styles.details}>Status: {campaign.status}</Text>
      <Text style={styles.details}>Capacity: {campaign.capacity}</Text>
      <View style={styles.buttons}>
        <Button title="Editar" onPress={handleEdit} />
        <Button title="Eliminar" onPress={handleDelete} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  details: { fontSize: 16, marginBottom: 5 },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }
});
