import React, { useState, useEffect, useCallback } from 'react';
import 'react-native-get-random-values';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Alert, Platform, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import * as Location from 'expo-location';
import { Modal, TextInput } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_PLACES_API_KEY, BASE_URL } from '@/config';

interface DonationPoint {
  id: number;
  name: string;  
  lat: number;
  lon: number;
  address: string;
}

export default function App() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [donationPoints, setDonationPoints] = useState<DonationPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPoint, setNewPoint] = useState<DonationPoint>({
    id: 0,
    name: '',
    lat: 0,
    lon: 0,
    address: ''
  });

  const fetchDonationPoints = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/donation_points/list`);
      const data = await response.json();
      
      if (data.points) {
        setDonationPoints(data.points);
      } else {
        Alert.alert('Error', 'Could not fetch donation points');
      }
    } catch (error) {
      Alert.alert('Error', 'Error fetching donation points');
    } finally {
      setIsLoading(false);
    }
  }, [BASE_URL]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Location permission denied');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        await fetchDonationPoints(); 
      } catch (error) {
        Alert.alert('Error', 'Could not get current location');
      }
    })();
  }, [fetchDonationPoints]);

  const createDonationPoint = async () => {
    if (!newPoint.name || !newPoint.address || !newPoint.lat || !newPoint.lon) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
  
    try {
      const response = await fetch(`${BASE_URL}/donation_points/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newPoint.name,
          address: newPoint.address,
          lat: newPoint.lat,
          lon: newPoint.lon
        })
      });
  
      const result = await response.json();
  
      if (result.id) {
        await fetchDonationPoints();
        setNewPoint({ id: 0, name: '', lat: 0, lon: 0, address: '' });
        setIsModalVisible(false);
        Alert.alert('Success', 'Donation point created');
      } else {
        Alert.alert('Error', 'Failed to create donation point');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView   
        style={styles.map}
        initialRegion={location ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        } : undefined}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="My Location"
            pinColor="blue"
          />
        )}

        {donationPoints.map((point) => (
          <Marker
            key={point.id}
            coordinate={{
              latitude: point.lat,
              longitude: point.lon,
            }}
            title={point.name}
            description={point.address}
            pinColor="red"
          />
        ))}
      </MapView>
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Agregar punto donativo</Text>
</TouchableOpacity>



<Modal
  animationType="slide"
  transparent={true}
  visible={isModalVisible}
  onRequestClose={() => setIsModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <GooglePlacesAutocomplete
        placeholder='Buscar'
        textInputProps={{  
          placeholderTextColor: '#666',
          returnKeyType: "search"
        }}  
        onPress={(data, details = null) => {
          if (details) {
            const { lat, lng } = details.geometry.location;
            setNewPoint(prev => ({
              ...prev,
              name: details.name || data.description,
              address: details.formatted_address || data.description,
              lat: lat,
              lon: lng
            }));
          }
        }}
        query={{
          key: GOOGLE_PLACES_API_KEY,
          language: 'en',
        }}
        fetchDetails={true}
        styles={{
          container: {
            flex: 0,
            width: '100%',
            zIndex: 1
          },
          textInput: {
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 5,
            color: 'black', // Input text color  
          },
          listView: {
            backgroundColor: 'white',
          },
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="Nombre punto donativo"
        placeholderTextColor="#666" 
        value={newPoint.name}
        onChangeText={(text) => setNewPoint(prev => ({...prev, name: text}))}
      />

      <TextInput
        style={styles.input}
        placeholder="Dirección"
        placeholderTextColor="#666" 
        value={newPoint.address}
        onChangeText={(text) => setNewPoint(prev => ({...prev, address: text}))}
      />

      <View style={styles.modalButtons}>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]}
          onPress={() => setIsModalVisible(false)}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.confirmButton]}
          onPress={createDonationPoint}
        >
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 100,
    left: 220,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  autocompleteContainer: {
    width: '100%',
    marginBottom: 10,
  },
  autocompleteInput: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white', // Ensure background is not hiding text
    color: 'black', // Ensure text color is visible
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'gray',
  },
  confirmButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});