import { View, Text, StyleSheet, Pressable, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Link } from 'expo-router';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { GestureHandlerRootView, ScrollView, TextInput } from 'react-native-gesture-handler';
import CreateCampaignModal from '../../../components/CreateCampaignModal'; // Update the import


type Campaign = {
  id: number;
  name: string;
  description: string;
  location: {
    city: string;
    state: string;
    distance: number;
  };
  date: string;
  status: 'Urgente' | 'Activo' | 'Programado';
  progress: {
    current: number;
    total: number;
  };
};

const StatusBadge = ({ status }: { status: Campaign['status'] }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Urgente':
        return '#FFEBE9';
      case 'Activo':
        return '#E6F4EA';
      case 'Programado':
        return '#E8F0FE';
      default:
        return '#E8F0FE';
    }
  };

  const getStatusTextColor = () => {
    switch (status) {
      case 'Urgente':
        return '#D93025';
      case 'Activo':
        return '#137333';
      case 'Programado':
        return '#1A73E8';
      default:
        return '#1A73E8';
    }
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
        {status}
      </Text>
    </View>
  );
};

const CampaignCard = ({ campaign }: { campaign: Campaign }) => (
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
              {campaign.location.city}, {campaign.location.state} ({campaign.location.distance.toFixed(1)}km)
            </Text>
          </View>
          
          <View style={styles.bottomInfo}>
            <View style={styles.dateContainer}>
              <MaterialIcons name="event" size={16} color="#666" />
              <Text style={styles.dateText}>{campaign.date}</Text>
            </View>
            
            <View style={styles.progressContainer}>
              <FontAwesome name="users" size={16} color="#666" />
              <Text style={styles.progressText}>
                {campaign.progress.current}/{campaign.progress.total}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.rightContent}>
          <StatusBadge status={campaign.status} />
        </View>
      </View>
    </Pressable>
  </Link>
);

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // Add this line

  useEffect(() => {
    // Mock data that matches the image
    const mockCampaigns: Campaign[] = [
      {
        id: 1,
        name: 'Ayuda por Inundaciones',
        description: 'Asistencia inmediata para damnificados',
        location: {
          city: 'Tlaquepaque',
          state: 'Jalisco',
          distance: 2651.0,
        },
        date: '03-11-2024',
        status: 'Urgente',
        progress: {
          current: 75,
          total: 100,
        },
      },
      {
        id: 2,
        name: 'Hospital Infantil de Zapopan',
        description: 'Apoyo para equipamiento médico',
        location: {
          city: 'Zapopan',
          state: 'Jalisco',
          distance: 2638.8,
        },
        date: '15-12-2024',
        status: 'Activo',
        progress: {
          current: 150,
          total: 300,
        },
      },
      // Add more campaigns as needed
    ];

    setCampaigns(mockCampaigns);
  }, []);

  const handleCreateCampaign = (newCampaign: { name: string; address: string }) => {
    // Here you would typically make an API call to create the campaign
    console.log('Creating new campaign:', newCampaign);
    // For demo purposes, we'll just add it to the local state
    const campaign: Campaign = {
      id: campaigns.length + 1,
      name: newCampaign.name,
      description: '',
      location: {
        city: 'Nueva Ciudad',
        state: 'Estado',
        distance: 0,
      },
      date: new Date().toLocaleDateString(),
      status: 'Programado',
      progress: {
        current: 0,
        total: 100,
      },
    };
    setCampaigns([...campaigns, campaign]);
  };

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

      {/* Create Campaign Modal */}
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
  }
});