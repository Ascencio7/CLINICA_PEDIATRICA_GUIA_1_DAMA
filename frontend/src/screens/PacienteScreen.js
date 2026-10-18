import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';

import UserBanner from '../components/UserBanner';
import { useSession } from '../context/SessionContext';

const API_URL = 'http://192.168.1.123:5000/api/patients';

const emptyForm = {
  nombre: '',
  telefono: '',
  correo: '',
  direccion: '',
  fechaNacimiento: '',
};

const PacientesScreen = () => {
  const { colors } = useSession();
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadPatients = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al consultar API');
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.warn('Error cargando pacientes desde Atlas:', error);
      Alert.alert('MongoDB Atlas', 'No se pudieron cargar los pacientes desde la nube.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPatients();
    }, [loadPatients])
  );

  // Función para formatear el teléfono: máximo 8 dígitos + guion (Ej: 1234-5678)
  const formatPhone = (text) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 8);
    if (cleaned.length > 4) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
    }
    return cleaned;
  };

  const setField = (field, value) => {
    if (field === 'telefono') {
      setForm(current => ({ ...current, [field]: formatPhone(value) }));
    } else {
      setForm(current => ({ ...current, [field]: value }));
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowDatePicker(false);
  };

  const calculateAge = (birthDateString) => {
    if (!birthDateString) return null;
    const today = new Date();
    const birthDate = new Date(`${birthDateString}T12:00:00`);
    if (Number.isNaN(birthDate.getTime())) return null;

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age === 0) {
      const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
      return months <= 1 ? 'Menos de 1 mes' : `${months} meses`;
    }
    return `${age} ${age === 1 ? 'año' : 'años'}`;
  };

  const formatDate = value => {
    if (!value) return '';
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('es-ES');
  };

  const parseDate = value => {
    if (!value) return new Date();
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? new Date() : date;
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (!selectedDate) return;

    const dateObj = new Date(selectedDate);
    if (Number.isNaN(dateObj.getTime())) return;

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    setField('fechaNacimiento', `${year}-${month}-${day}`);
  };

  const savePatient = async () => {
    if (!form.nombre.trim()) {
      Alert.alert('Validación', 'El nombre del paciente es obligatorio.');
      return;
    }

    const patientData = {
      name: form.nombre.trim(),
      nombre: form.nombre.trim(),
      phone: form.telefono,
      telefono: form.telefono,
      email: form.correo,
      correo: form.correo,
      address: form.direccion,
      direccion: form.direccion,
      birthDate: form.fechaNacimiento,
      fechaNacimiento: form.fechaNacimiento,
      age: calculateAge(form.fechaNacimiento),
      edad: calculateAge(form.fechaNacimiento),
    };

    try {
      let response;
      if (editingId) {
        response = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patientData),
        });
      } else {
        response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patientData),
        });
      }

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || resData.message || 'Error al guardar datos');
      }

      resetForm();
      await loadPatients();
      Alert.alert('Éxito', `Paciente ${editingId ? 'actualizado' : 'registrado'} en MongoDB Atlas`);
    } catch (error) {
      console.warn('Error guardando paciente en Atlas:', error.message);
      Alert.alert('Error del Servidor', error.message);
    }
  };

  const editPatient = patient => {
    setEditingId(patient._id || patient.id);
    setForm({
      nombre: patient.nombre || patient.name || '',
      telefono: patient.telefono || patient.phone || '',
      correo: patient.correo || patient.email || '',
      direccion: patient.direccion || patient.address || '',
      fechaNacimiento: patient.fechaNacimiento || patient.fecha_nacimiento || patient.birthDate || '',
    });
  };

  const removePatient = id => {
    Alert.alert('Confirmar', '¿Estás seguro de eliminar este paciente de la nube?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            const response = await fetch(`${API_URL}/${id}`, {
              method: 'DELETE',
            });
            if (!response.ok) throw new Error('Error al eliminar');
            await loadPatients();
          } catch (error) {
            console.warn('Error eliminando paciente de Atlas:', error);
            Alert.alert('Error', 'No se pudo eliminar el paciente.');
          }
        },
      },
    ]);
  };

  const filteredPatients = patients.filter(p => {
    const nombre = p.nombre || p.name || '';
    const telefono = p.telefono || p.phone || '';
    const query = searchQuery.toLowerCase();
    
    return nombre.toLowerCase().includes(query) || telefono.includes(query);
  });

  const renderItem = ({ item }) => {
    const patientId = item._id || item.id;
    const nombre = item.nombre || item.name || 'Sin Nombre';
    const telefono = item.telefono || item.phone || '';
    const correo = item.correo || item.email || '';
    const direccion = item.direccion || item.address || '';
    const fechaNac = item.fechaNacimiento || item.fecha_nacimiento || item.birthDate || '';
    
    const computedAge = calculateAge(fechaNac) || (item.edad || item.age ? `${item.edad || item.age}` : '');

    return (
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{nombre.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.patientMainInfo}>
            <Text style={[styles.patientName, { color: colors.text }]}>{nombre}</Text>
            {computedAge ? (
              <Text style={[styles.ageBadge, { color: colors.primary || '#087EA4' }]}>
                {computedAge}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.cardBody}>
          {telefono ? <Text style={[styles.detailText, { color: colors.secondaryText }]}>📞 {telefono}</Text> : null}
          {correo ? <Text style={[styles.detailText, { color: colors.secondaryText }]}>✉️ {correo}</Text> : null}
          {direccion ? <Text style={[styles.detailText, { color: colors.secondaryText }]}>📍 {direccion}</Text> : null}
          {fechaNac ? (
            <Text style={[styles.detailText, { color: colors.secondaryText }]}>
              🎂 {formatDate(fechaNac)}
            </Text>
          ) : null}
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.editBtn} onPress={() => editPatient(item)}>
            <Text style={styles.editBtnText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => removePatient(patientId)}>
            <Text style={styles.deleteBtnText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={filteredPatients}
        keyExtractor={item => String(item._id || item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.scrollContent}
        refreshing={loading}
        onRefresh={loadPatients}
        ListHeaderComponent={
          <>
            <UserBanner />

            <View style={styles.headingRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { color: colors.text }]}>Pacientes Pediátricos</Text>
                <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
                  Gestión y expedientes en la nube (Atlas)
                </Text>
              </View>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{patients.length}</Text>
                <Text style={styles.countLabel}>total</Text>
              </View>
            </View>

            <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.formHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.formTitle, { color: colors.text }]}>
                    {editingId ? '✏️ Editar Paciente' : 'Nuevo Paciente'}
                  </Text>
                  <Text style={[styles.formHint, { color: colors.secondaryText }]}>
                    Ingrese los datos del infante y contacto
                  </Text>
                </View>
                <TouchableOpacity style={styles.clearButton} onPress={resetForm}>
                  <Text style={styles.clearText}>Limpiar</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formGrid}>
                <View style={styles.fullWidthInput}>
                  <TextInput
                    placeholder="Nombre completo del paciente *"
                    placeholderTextColor={colors.secondaryText}
                    style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
                    value={form.nombre}
                    onChangeText={value => setField('nombre', value)}
                  />
                </View>

                <View style={styles.responsiveCol}>
                  <TextInput
                    placeholder="Teléfono (8 dígitos)"
                    placeholderTextColor={colors.secondaryText}
                    style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
                    value={form.telefono}
                    onChangeText={value => setField('telefono', value)}
                    keyboardType="phone-pad"
                    maxLength={9} // 8 dígitos + 1 guion
                  />
                </View>

                <View style={styles.responsiveCol}>
                  <TextInput
                    placeholder="Correo electrónico"
                    placeholderTextColor={colors.secondaryText}
                    style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
                    value={form.correo}
                    onChangeText={value => setField('correo', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.responsiveCol}>
                  <TextInput
                    placeholder="Dirección residencial"
                    placeholderTextColor={colors.secondaryText}
                    style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
                    value={form.direccion}
                    onChangeText={value => setField('direccion', value)}
                  />
                </View>

                <View style={styles.responsiveCol}>
                  <TouchableOpacity
                    style={[styles.dateButton, { backgroundColor: colors.input, borderColor: colors.border }]}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text
                      numberOfLines={1}
                      style={[styles.dateLabel, { color: form.fechaNacimiento ? colors.text : colors.secondaryText }]}
                    >
                      {form.fechaNacimiento ? formatDate(form.fechaNacimiento) : 'Fecha nacimiento'}
                    </Text>
                    <Text style={styles.calendarIcon}>📅</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={parseDate(form.fechaNacimiento)}
                  mode="date"
                  display="default"
                  maximumDate={new Date()}
                  onChange={handleDateChange}
                />
              )}

              <View style={styles.actionRow}>
                {editingId ? (
                  <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
                    <Text style={styles.cancelText}>Cancelar</Text>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity style={styles.saveBtn} onPress={savePatient}>
                  <Text style={styles.saveBtnText}>{editingId ? 'Guardar Cambios' : 'Registrar Paciente'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={[styles.listTitle, { color: colors.text }]}>Pacientes Registrados en Atlas</Text>
            <TextInput
              placeholder="Buscar paciente por nombre o teléfono..."
              placeholderTextColor={colors.secondaryText}
              style={[styles.searchInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </>
        }
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
            {loading ? 'Cargando pacientes desde la nube...' : 'No hay pacientes registrados en el clúster.'}
          </Text>
        }
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  countBadge: {
    backgroundColor: '#E6F4F1',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  countText: {
    color: '#087EA4',
    fontSize: 18,
    fontWeight: '800',
  },
  countLabel: {
    color: '#087EA4',
    fontSize: 10,
    fontWeight: '600',
  },
  formCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  formHint: {
    fontSize: 12,
    marginTop: 2,
  },
  clearButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  clearText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '700',
  },
  formGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  fullWidthInput: {
    width: '100%',
    paddingHorizontal: 4,
    marginBottom: 10,
  },
  responsiveCol: {
    width: '50%',
    minWidth: 140,
    paddingHorizontal: 4,
    marginBottom: 10,
    flexGrow: 1,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  dateButton: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateLabel: {
    fontSize: 13,
    flex: 1,
  },
  calendarIcon: {
    fontSize: 14,
    marginLeft: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  cancelText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 13,
  },
  saveBtn: {
    backgroundColor: '#0A4D68',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  listTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8,
  },
  searchInput: {
    height: 42,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 14,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#D9F0F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#0A4D68',
    fontSize: 16,
    fontWeight: '800',
  },
  patientMainInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
  },
  ageBadge: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 1,
  },
  cardBody: {
    marginBottom: 10,
    gap: 2,
  },
  detailText: {
    fontSize: 13,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
    pt: 8,
    paddingTop: 8,
  },
  editBtn: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editBtnText: {
    color: '#0A4D68',
    fontSize: 12,
    fontWeight: '700',
  },
  deleteBtn: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteBtnText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 24,
    fontSize: 14,
  },
});

export default PacientesScreen;