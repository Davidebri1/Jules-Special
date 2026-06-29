import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

interface TopBarProps {
  title?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ title = 'Collider AI' }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity style={styles.profileButton}>
        <Ionicons name="person-circle-outline" size={32} color={theme.colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl, // Assuming no safe area view for simplicity in prototype, adjust if needed
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    ...theme.typography.title,
  },
  profileButton: {
    padding: 4,
  },
});
