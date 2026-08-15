import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Pantallas con los nombres EXACTOS de tu estructura
import LoginScreen from './frontend/src/screens/LoginScreen';
import HomeScreen from './frontend/src/screens/HomeScreen';
import ProfileScreen from './frontend/src/screens/ProfileScreen';
import SettingsScreen from './frontend/src/screens/SettingsScreen';
import PacienteScreen from './frontend/src/screens/PacienteScreen'; // 👈 Nombre en singular
import AppointmentScreen from './frontend/src/screens/AppointmentScreen';
import MedicalHistoryScreen from './frontend/src/screens/MedicalHistoryScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: '#0A4D68' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Clínica Pediátrica' }} 
        />
        {/* Usamos "Pacientes" para que navigation.navigate('Pacientes') funcione */}
        <Stack.Screen 
          name="Pacientes" 
          component={PacienteScreen} 
          options={{ title: 'Gestión de Pacientes' }} 
        />
        <Stack.Screen
          name="Citas"
          component={AppointmentScreen}
          options={{ title: 'Citas' }}
        />
        <Stack.Screen
          name="Historial"
          component={MedicalHistoryScreen}
          options={{ title: 'Historial Médico' }}
        />
        <Stack.Screen 
          name="Perfil" 
          component={ProfileScreen} 
          options={{ title: 'Mi Perfil' }} 
        />
        <Stack.Screen 
          name="Configuracion" 
          component={SettingsScreen} 
          options={{ title: 'Ajustes' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;