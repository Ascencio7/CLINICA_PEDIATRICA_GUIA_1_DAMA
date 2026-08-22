import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserBanner from '../components/UserBanner';
import { useSession } from '../context/SessionContext';

const ProfileScreen = ({ navigation }) => {
  const { userName, colors } = useSession();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <UserBanner />
        {/* Avatar / Tarjeta de Presentación */}
        <View style={styles.avatarCard}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}></Text>
          </View>
          <Text style={[styles.doctorName, { color: colors.text }]}>{userName}</Text>
          <Text style={styles.specialty}>Pediatra General / Neonatólogo</Text>
        </View>

        {/* Sección de Detalles */}
        <View style={[styles.infoSection, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, borderBottomColor: colors.border }]}>Información Profesional</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Especialidad</Text>
            <Text style={styles.infoValue}>Pediatría</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>N° de Colegiado</Text>
            <Text style={styles.infoValue}>CP-84920</Text>
          </View>

          <View style={styles.infoRowColumn}>
            <Text style={styles.infoLabel}>Correo Electrónico</Text>
            <Text style={styles.infoValueEmail}>ascencio32@clinicapediatrica.com</Text>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Teléfono de Contacto</Text>
            <Text style={styles.infoValue}>+503 6107-8146</Text>
          </View>
        </View>

        {/* Botón de Acción */}
        <TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: '#0A4D68', marginTop: 12 }]}
          activeOpacity={0.8}
          onPress={() => navigation?.navigate('Historial')}
        >
          <Text style={styles.editButtonText}>Ver Historial Médico</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  avatarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E2F1E7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 36,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
  },
  specialty: {
    fontSize: 14,
    color: '#243A73',
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  infoRowColumn: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
  },
  infoValueEmail: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
    marginTop: 4,
  },
  editButton: {
    backgroundColor: '#243A73',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;