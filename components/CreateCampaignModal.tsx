import { View, Text, StyleSheet, Pressable, Modal, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import React, { useState } from 'react';
import { ScrollView, Switch, TextInput, TouchableWithoutFeedback} from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const CreateCampaignModal = ({
  visible,
  onClose,
  onSubmit
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (campaign: { description: string; name: string; address: string; active: boolean; start_date: Date; end_date: Date }) => void;
}) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleSubmit = () => {
    const startDateOnly = new Date(startDate.setHours(0, 0, 0, 0));
    const endDateOnly = new Date(endDate.setHours(0, 0, 0, 0));
  
    console.log(endDate)
    console.log(startDate)
    if (endDate < startDate) {
      Alert.alert(
        "Fecha inválida",
        "La fecha de fin no puede ser anterior a la fecha de inicio."
      );
      return;
    }
    onSubmit({ description, name, address, active, start_date: startDate, end_date: endDate });
    setName('');
    setAddress('');
    setDescription('');
    setStartDate(new Date());
    setEndDate(new Date());
    onClose();
  };

  const handleStartDateChange = (event: any, date?: Date) => {
    setShowStartDatePicker(false);
    if (date) {
      setStartDate(date);
    }
  };

  const handleEndDateChange = (event: any, date?: Date) => {
    setShowEndDatePicker(false);
    if (date) {
      setEndDate(date);
    }
  };


  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nueva Campaña</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#666" />
            </Pressable>
          </View>

          <ScrollView style={styles.formContainer}>
            <View >
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Nombre de la campaña"
                placeholderTextColor="#999"
              />
            </View>

            <View >
              <Text style={styles.label}>Dirección</Text>
              <TextInput
                style={[styles.input]}
                value={address}
                onChangeText={setAddress}
                placeholder="Dirección"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />
            </View>

            <View >
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Descripción de la campaña"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />
            </View>

            <View >
            <Text style={styles.label}>Fecha de Inicio</Text>
            <Pressable onPress={() => setShowStartDatePicker(true)}>
              <Text style={styles.dateText}>
                {startDate.toLocaleDateString('es-ES')}
              </Text>
            </Pressable>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={handleStartDateChange}
              />
            )}
          </View>

          <View >
            <Text style={styles.label}>Fecha de Fin</Text>
            <Pressable onPress={() => setShowEndDatePicker(true)}>
              <Text style={styles.dateText}>
                {endDate.toLocaleDateString('es-ES')}
              </Text>
            </Pressable>
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={handleEndDateChange}
              />
            )}
          </View>


          <View style={styles.switchContainer}>
          <Text style={{fontSize: 15}}>Activa</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={active ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => setActive(!active)}
                value={active}
              />
            </View>

            <View >
            <Pressable 
              style={[
                styles.submitButton,
                (!name || !address || !description || !startDate || !endDate) && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!name || !address || !description || !startDate || !endDate}
            >
              <Text style={styles.submitButtonText}>Crear Campaña</Text>
            </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,  // Add some vertical padding
    marginBottom: 16,    // Add space between this and the next element
  },
  dateText: {
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
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
  formContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 9, 
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F5F5F5',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#0a5fb4',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#8eaac4',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F5F5F5',
  },
  activeButtonActive: {
    backgroundColor: '#0a5fb4',
    borderColor: '#0a5fb4',
  },
  activeButtonText: {
    fontSize: 16,
    color: '#333',
  },
  activeButtonTextActive: {
    color: '#FFF',
  },
});

export default CreateCampaignModal;