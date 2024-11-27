import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

type DonationDetails = {
  donation: {
    created_at: string;
    date: string;
    id: number;
    pending: boolean;
  };
  donor: Array<{
    name: string;
    phone: string;
  }>;
  food_items: Array<{
    category: string;
    name: string;
    quantity: number;
    perishable: boolean;
  }>;
  total_food_items: number;
};

type DonationModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onReject: () => void;
  donationDetails: DonationDetails | null;
};

const DonationDetailsModal = ({
  visible,
  onClose,
  onConfirm,
  onReject,
  donationDetails,
}: DonationModalProps) => {
  if (!donationDetails) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalles de la Donación</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#666" />
            </Pressable>
          </View>

          <ScrollView style={styles.detailsContainer}>
            {/* Donor Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Información del Donante</Text>
              <Text style={styles.detailText}>Nombre: {donationDetails.donor[0].name}</Text>
              <Text style={styles.detailText}>Teléfono: {donationDetails.donor[0].phone}</Text>
            </View>

            {/* Donation Date */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fecha de Creación</Text>
              <Text style={styles.detailText}>
                {formatDate(donationDetails.donation.created_at)}
              </Text>
            </View>

            {/* Food Items */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Alimentos Donados</Text>
              <Text style={styles.detailText}>
                Cantidad de alimentos: {donationDetails.total_food_items}
              </Text>
              {donationDetails.food_items.map((item, index) => (
                <View key={index} style={styles.foodItem}>
                  <Text style={styles.detailText}>Nombre: {item.name}</Text>
                  <Text style={styles.detailText}>Categoría: {item.category}</Text>
                  <Text style={styles.detailText}>Cantidad: {item.quantity}</Text>
                  <Text style={styles.detailText}>
                    Perecedero: {item.perishable ? 'Sí' : 'No'}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Pressable 
              style={[styles.button, styles.rejectButton]} 
              onPress={onReject}
            >
              <Text style={styles.buttonText}>Rechazar</Text>
            </Pressable>
            <Pressable 
              style={[styles.button, styles.confirmButton]} 
              onPress={onConfirm}
            >
              <Text style={styles.buttonText}>Confirmar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  detailsContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 4,
    color: '#666',
  },
  foodItem: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DonationDetailsModal;