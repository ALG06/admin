import React from 'react';
import { Stack } from 'expo-router';
import Header from '@/components/Header'; // Ensure the path is correct

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{
          headerShown: false
          //header: () => <Header title="Campañas de Donación" subtitle="Punto Donativo" />
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{
          title: "Donación",
          header: () => <Header title="Donacion" subtitle="Detalles" />
        }} 
      />
    </Stack>
  );
}