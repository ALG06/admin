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
import { useEffect, useRef } from "react";
import { Overlay } from "../../../components/Overlay";

export default function QRScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);

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
            console.log(data); // Log the QR code content to the console
            setTimeout(() => {
              qrLock.current = false; // Reset qrLock after logging
            }, 500);
          }
        }}
      />
      <Overlay />
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