import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { Wallpaper } from '../types';

interface Props {
  visible: boolean;
  onClose: () => void;
  wallpapers: Wallpaper[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const WallpaperSwitcher: React.FC<Props> = ({ visible, onClose, wallpapers, selectedId, onSelect }) => {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Environment Theme</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
            {wallpapers.map(wp => (
              <TouchableOpacity
                key={wp.id}
                style={[styles.item, selectedId === wp.id && styles.itemSelected]}
                onPress={() => onSelect(wp.id)}
              >
                <View style={[styles.preview, { backgroundColor: wp.type === 'color' ? wp.value : '#333' }]}>
                   {wp.type === 'image' && <Ionicons name="image-outline" size={24} color="#aaa" />}
                </View>
                <Text style={styles.name}>{wp.name}</Text>
                {selectedId === wp.id && <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    ...theme.typography.title,
    fontSize: 20,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: theme.spacing.lg,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  itemSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
  preview: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  name: {
    ...theme.typography.body,
    flex: 1,
  }
});
