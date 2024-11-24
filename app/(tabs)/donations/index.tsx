// donations/index.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Archive, Clock, Scale, Calendar } from 'lucide-react-native';
import Header from '@/components/Header';

// Mock data structure based on your DB schema
const mockDonations = [
  {
    ID_donacion: 1,
    ID_donante: 1,
    ID_punto: 1,
    ID_calendario: 1,
    Fecha: '11-11-2024',
    Hora: '14:00',
    Estado: true, // true for active, false for completed
    Tipo: 'Alimento',
    alimento: {
      ID_alimento: 1,
      Nombre_alimento: 'Arroz',
      Cantidad: 4.00,
      Categoria: 'Granos'
    }
  },
  {
    ID_donacion: 2,
    ID_donante: 2,
    ID_punto: 1,
    ID_calendario: 2,
    Fecha: '10-11-2024',
    Hora: '15:00',
    Estado: true,
    Tipo: 'Alimento',
    alimento: {
      ID_alimento: 2,
      Nombre_alimento: 'Atún',
      Cantidad: 2.00,
      Categoria: 'Enlatados'
    }
  },
  {
    ID_donacion: 3,
    ID_donante: 3,
    ID_punto: 2,
    ID_calendario: 3,
    Fecha: '11-11-2024',
    Hora: '10:00',
    Estado: false,
    Tipo: 'Alimento',
    alimento: {
      ID_alimento: 3,
      Nombre_alimento: 'Frijol',
      Cantidad: 7.00,
      Categoria: 'Granos'
    }
  },
  {
    ID_donacion: 4,
    ID_donante: 4,
    ID_punto: 2,
    ID_calendario: 4,
    Fecha: '10-11-2024',
    Hora: '09:00',
    Estado: false,
    Tipo: 'Alimento',
    alimento: {
      ID_alimento: 4,
      Nombre_alimento: 'Gitomate',
      Cantidad: 20.00,
      Categoria: 'Verduras'
    }
  }
];

export default function DonationScreen() {
  const [showActive, setShowActive] = useState(true);
  
  const filteredDonations = mockDonations.filter(
    donation => donation.Estado === showActive
  );

  return (
    <View style={styles.container}>
        <Header title='Donaciones' subtitle='Punto Donativo'/>
        <TouchableOpacity 
          onPress={() => setShowActive(!showActive)}
          style={styles.toggleButton}
        >
          {showActive ? (
            <Clock size={20} color="#EC4899" />
          ) : (
            <Archive size={20} color="#EC4899" />
          )}
          <Text style={styles.toggleText}>
            {showActive ? 'Donaciones Activas' : 'Donaciones Pasadas'}
          </Text>
        </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        {filteredDonations.map((donation) => (
          <View key={donation.ID_donacion} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>
                {donation.alimento.Nombre_alimento}
              </Text>
              <View style={[
                styles.badge,
                donation.Estado ? styles.activeBadge : styles.completedBadge
              ]}>
                <Text style={[
                  styles.badgeText,
                  donation.Estado ? styles.activeText : styles.completedText
                ]}>
                  {donation.Estado ? 'Activa' : 'Completada'}
                </Text>
              </View>
            </View>
            
            <View style={styles.cardFooter}>
              <Scale size={16} color="#6B7280" />
              <Text style={styles.footerText}>
                {donation.alimento.Cantidad.toFixed(2)} kg
              </Text>
              <Text style={styles.bullet}>•</Text>
              <Calendar size={16} color="#6B7280" />
              <Text style={styles.footerText}>
                {donation.Fecha}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingLeft: 16
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  activeBadge: {
    backgroundColor: '#DBEAFE',
  },
  completedBadge: {
    backgroundColor: '#F3F4F6',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeText: {
    color: '#2563EB',
  },
  completedText: {
    color: '#4B5563',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    marginLeft: 4,
    color: '#6B7280',
  },
  bullet: {
    marginHorizontal: 8,
    color: '#9CA3AF',
  },
});