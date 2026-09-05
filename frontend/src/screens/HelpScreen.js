import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserBanner from '../components/UserBanner';
import { useSession } from '../context/SessionContext';

const HelpScreen = () => {
  const { colors } = useSession();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <UserBanner />
        <Text style={[styles.title, { color: colors.text }]}>Ayuda</Text>
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Encuentra orientación para utilizar la clínica.</Text>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>¿Cómo comenzar?</Text>
          <Text style={[styles.cardText, { color: colors.secondaryText }]}>Desde Inicio puedes consultar tus accesos principales, gestionar pacientes y revisar la agenda de citas.</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Soporte</Text>
          <Text style={[styles.cardText, { color: colors.secondaryText }]}>Para asistencia técnica, contacta al administrador de la clínica.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 16 },
  subtitle: { fontSize: 14, marginTop: 6, marginBottom: 16 },
  card: { borderRadius: 14, padding: 16, marginBottom: 12, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  cardText: { fontSize: 14, lineHeight: 21 },
});

export default HelpScreen;
