// donations/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { Archive, Clock } from 'lucide-react-native';
import Header from '@/components/Header';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';

const StatusBadge = ({ active }: { active: boolean }) => {
  const getStatusColor = () => (active ? '#FFEBE9' : '#E6F4EA');
  const getStatusTextColor = () => (active ? '#D93025' : '#137333');

  return (
    <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
      <Text style={[styles.statusText, { color: getStatusTextColor() }]}>
        {active ? 'Pendiente' : 'Completada'}
      </Text>
    </View>
  );
};

const DonationScreen = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [showPending, setShowPending] = useState(true);
  const [loading, setLoading] = useState(true);

  const baseURL = Platform.OS === 'ios' ? 'http://192.168.100.10:5000' : 'http://10.0.2.2:5000';

  // Fetch data from the endpoint
  useFocusEffect(
    React.useCallback(() => {
      const fetchDonations = async () => {
        try {
          const response = await axios.get(`${baseURL}/donations/list`);
          setDonations(response.data);
        } catch (error) {
          console.error('Error fetching donations:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchDonations();
    }, [])
  );

  // Filter donations based on pending status
  const filteredDonations = donations.filter(
    (donation) => donation.pending === showPending
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#EC4899" />
      </View>
    );
  }

  return (
    <View style={[styles.container, {paddingBottom: 100}]}>
      <Header title="Donaciones" subtitle="Punto Donativo" />
      
      {/* Toggle Button */}
      <TouchableOpacity 
        onPress={() => setShowPending(!showPending)}
        style={styles.toggleButton}
      >
        {showPending ? (
          <Clock size={20} color="#EC4899" />
        ) : (
          <Archive size={20} color="#EC4899" />
        )}
        <Text style={styles.toggleText}>
          {showPending ? 'Donaciones Pendientes' : 'Donaciones Pasadas'}
        </Text>
      </TouchableOpacity>

      {/* Donations List */}
      <ScrollView style={styles.scrollView}>
  {filteredDonations.map((donation) => (
    <Link
      key={donation.id} 
      href={`./donations/${donation.id}`} 
      asChild
    >
      <TouchableOpacity style={styles.card}>
        <Text style={styles.cardTitle}>ID: {donation.id}</Text>
        <Text style={styles.cardText}>Fecha: {donation.date}</Text>
        <View style={styles.statusRow}>
            <Text style={styles.cardText}>Estado: </Text>
            <StatusBadge active={donation.pending} />
          </View>
      </TouchableOpacity>
    </Link>
  ))}
</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingLeft: 16,
  },
  toggleText: {
    marginLeft: 8,
    color: '#EC4899',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default DonationScreen;
