import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSession } from '../context/SessionContext';

const UserBanner = () => {
  const { userName } = useSession();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Sesión activa</Text>
      <Text style={styles.name}>{userName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E2F1E7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  label: {
    color: '#46735A',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  name: {
    color: '#1F5135',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
});

export default UserBanner;
