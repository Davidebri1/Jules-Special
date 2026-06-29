import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { ExpertModel, ActionWidgetProps } from '../types';

interface CollideModalProps {
  visible: boolean;
  onClose: () => void;
  widget: ActionWidgetProps;
  models: ExpertModel[];
  onConfirm: (selectedModelIds: string[], totalCost: number) => void;
}

export const CollideModal: React.FC<CollideModalProps> = ({ visible, onClose, widget, models, onConfirm }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleModel = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  const calculateTotalCost = () => {
    if (selectedIds.length === 0) return 0; // Or return base cost if always charging something
    let multiplierSum = selectedIds.reduce((sum, id) => {
      const model = models.find(m => m.id === id);
      return sum + (model ? model.costMultiplier : 0);
    }, 0);
    return Math.round(widget.cost * multiplierSum);
  };

  const totalCost = calculateTotalCost();

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Evaluate with other Models</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.contextCard}>
            <Text style={styles.contextTitle}>Current Action: {widget.title}</Text>
            <Text style={styles.contextDescription}>Select expert lenses to evaluate and generate alternative approaches simultaneously.</Text>
          </View>

          <ScrollView style={styles.modelsList} contentContainerStyle={styles.modelsListContent}>
            {models.map(model => {
              const isSelected = selectedIds.includes(model.id);
              return (
                <TouchableOpacity
                  key={model.id}
                  style={[styles.modelCard, isSelected && styles.modelCardSelected]}
                  onPress={() => toggleModel(model.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.modelHeader}>
                    <Text style={styles.modelName}>{model.name}</Text>
                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                      {isSelected && <Ionicons name="checkmark" size={14} color={theme.colors.onPrimary} />}
                    </View>
                  </View>
                  <Text style={styles.modelLens}>{model.lens}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.confirmButton, selectedIds.length === 0 && styles.confirmButtonDisabled]}
              onPress={() => onConfirm(selectedIds, totalCost)}
              disabled={selectedIds.length === 0}
            >
              <Text style={styles.confirmText}>
                {selectedIds.length === 0 ? 'Select models' : `Generate Alternatives • ${totalCost} Credits`}
              </Text>
            </TouchableOpacity>
          </View>
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
  contextCard: {
    margin: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  contextTitle: {
    ...theme.typography.label,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  contextDescription: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  modelsList: {
    flex: 1,
  },
  modelsListContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  modelCard: {
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modelCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
  modelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  modelName: {
    ...theme.typography.label,
    fontSize: 16,
    color: theme.colors.text,
  },
  modelLens: {
    ...theme.typography.body,
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: theme.colors.surfaceBright,
  },
  confirmText: {
    ...theme.typography.label,
    color: theme.colors.onPrimary,
    fontSize: 16,
  }
});
