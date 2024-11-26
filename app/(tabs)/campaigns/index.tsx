import { View, Text, StyleSheet, Pressable, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Link } from 'expo-router';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { GestureHandlerRootView, ScrollView, TextInput } from 'react-native-gesture-handler';
import CreateCampaignModal from '../../../components/CreateCampaignModal'; // Update the import
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';


type Campaign = {
  id: number;
  name: string;
  description: string;
  address: string;
  active: boolean;
  start_date: string;
  end_date: string;
  lat: number;
  lon: number;
  created_at: string;
};

const StatusBadge = ({ active }: { active: boolean }) => {
  const getStatusColor = () => {
    return active ? '#E6F4EA' : '#FFEBE9';
  };

  const getStatusTextColor = () => {
    return active ? '#137333' : '#D93025';
  };

  return (
    <View
      style={[
        styles.statusBadge,
        { backgroundColor: getStatusColor() }
      ]}
    >
      <Text style={[
        styles.statusText,
        { color: getStatusTextColor() }
      ]}>
        {active ? 'Activo' : 'Inactivo'}
      </Text>
    </View>
  );
};

const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
  // Calculate distance (you might want to replace this with actual distance calculation)
  const calculateDistance = () => {
    // Placeholder distance calculation - replace with actual logic if needed
    return 0;
  };

  return (
    <Link
      href={`./campaigns/${campaign.id}`}
      asChild
    >
      <Pressable style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.mainInfo}>
            <Text style={styles.title}>{campaign.name}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {campaign.description}
            </Text>
            
            <View style={styles.locationContainer}>
              <MaterialIcons name="location-on" size={16} color="#666" />
              <Text style={styles.locationText}>
                {campaign.address}
              </Text>
            </View>
            
            <View style={styles.bottomInfo}>
              <View style={styles.dateContainer}>
                <MaterialIcons name="event" size={16} color="#666" />
                <Text style={styles.dateText}>
                  {new Date(campaign.start_date).toLocaleDateString()}
                </Text>
              </View>
              
              <View style={styles.progressContainer}>
                <FontAwesome name="calendar" size={16} color="#666" />
                <Text style={styles.progressText}>
                  {new Date(campaign.end_date).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.rightContent}>
            <StatusBadge active={campaign.active} />
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
   React.useCallback(() => {
     fetchCampaigns();
   }, [])
  );

  // Determine the base URL based on the platform
  const baseURL = Platform.OS === 'ios' ? 'http://127.0.0.1:5000' : 'http://10.0.2.2:5000';

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseURL}/campaigns/list?active=true`);
      setCampaigns(response.data);
      setError(null);
    } catch (err) {
      const error = err as Error;
      console.error('Error fetching campaigns:', error.message);
      setError('Failed to load campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCampaign = async (newCampaign: { name: string; address: string }) => {
    try {
      // Implement actual API call to create campaign
      console.log('Creating new campaign:', newCampaign);
      
      // Optional: Refresh campaigns after creation
      fetchCampaigns();
    } catch (err) {
      console.error('Error creating campaign:', err);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Cargando campañas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable onPress={fetchCampaigns}>
          <Text>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.container}>
        <Header title="Campañas de Donación" subtitle='Punto Donativo'/>
      
        {campaigns.map((campaign) => ( 
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}

        <Pressable 
          style={styles.fab}
          onPress={() => setIsModalVisible(true)}
        >
          <MaterialIcons name="add" size={24} color="#FFF" />
        </Pressable>

        <CreateCampaignModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSubmit={handleCreateCampaign}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mainInfo: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  bottomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  dateText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  rightContent: {
    justifyContent: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    backgroundColor: '#0a5fb4',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center'
  },
});