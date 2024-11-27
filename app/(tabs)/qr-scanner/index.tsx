import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import {
  AppState,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { Overlay } from "../../../components/Overlay";
import DonationDetailsModal from "../../../components/DonationDetailsModal";
import axios from "axios";

export default function QRScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const [modalVisible, setModalVisible] = useState(false);
  const [donationDetails, setDonationDetails] = useState(null);
  const [scannedData, setScannedData] = useState<string | null>(null);

  const baseURL = Platform.OS === 'ios' ? 'http://192.168.100.10:5000' : 'http://10.0.2.2:5000';
  
  const fetchDonationDetails = async (id: string) => {
    try {  
      setScannedData(id)
      const response = await axios.get(`${baseURL}/donations/details/${id}`);
      setDonationDetails(response.data);
      console.log(donationDetails)
      setModalVisible(true);  
    } catch (error) {    
      Alert.alert(
        "Error",
        "No se pudo obtener los detalles de la donación, la donación no existe o ya fue confirmada",
      );  
      console.error(error);
    }  
  };

/*   useEffect(() => {
    // Simulate fetching donation details when the component mounts
    const simulateFetch = async () => {
      const simulatedId = "3"; // Replace with a test ID
      await fetchDonationDetails(simulatedId);
    };

    simulateFetch();
  }, []); */

  const handleConfirmDonation = async (id: string) => {
    setModalVisible(false);
    try {
        await axios.put(`${baseURL}/donations/update`, {
        id: id,
        pending: false
      });
      Alert.alert("Éxito", "Donación confirmada");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la donación");
      console.error(error);
    }
  };

  const handleRejectDonation = () => {  
    setModalVisible(false);
    Alert.alert("Información", "Donación rechazada");
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // If permissions aren't determined yet
  if (!permission) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.title}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.title}>QR Code Scanner</Text>
        <View style={{ gap: 20 }}>
          <Pressable
            onPress={async () => {
              const { granted } = await requestPermission();
              if (!granted) {
                Alert.alert(
                  "Permiso requerido",
                  "Otorga permiso desde configuración"
                );
              }
            }}
          >
            <Text style={styles.buttonStyle}>Request Camera Permission</Text>
          </Pressable>
          <Text style={styles.subtitle}>
            El acceso a la cámara es necesario para escanear. 
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // If permissions are granted, show the scanner
  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      {Platform.OS === "android" ? <StatusBar hidden /> : null}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={({ data }) => {
          if (data && !qrLock.current) {
            qrLock.current = true;
            console.log(data);
            setScannedData(data); 
            fetchDonationDetails(data); // Log the QR code content to the console
            setTimeout(() => {
              qrLock.current = false; // Reset qrLock after logging
            }, 1200);
          }
        }}
      />
      <Overlay />

      <DonationDetailsModal
        visible={modalVisible}  
        onClose={() => setModalVisible(false)}
        onConfirm={() => scannedData ? handleConfirmDonation(scannedData) : null}
        onReject={handleRejectDonation}
        donationDetails={donationDetails}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  permissionContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "black",
    justifyContent: "space-around",
    paddingVertical: 80,
  },
  title: {
    color: "white",
    fontSize: 40,
  },
  subtitle: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
  },
  buttonStyle: {
    color: "#0E7AFE",
    fontSize: 20,
    textAlign: "center",
  },
});