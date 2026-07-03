import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { ActionWidgetProps } from '../types';

interface Props {
  widget: ActionWidgetProps;
  onPress: () => void;
}

export const ActionWidget: React.FC<Props> = ({ widget, onPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{widget.title}</Text>
        <Text style={styles.description}>{widget.description}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Generate — {widget.cost} Credits</Text>
        <Ionicons name="sparkles" size={16} color={theme.colors.onPrimary} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    // Add a subtle glow for the 'magic' feel
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
  },
  content: {
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.title,
    fontSize: 18,
    marginBottom: theme.spacing.xs,
  },
  description: {
    ...theme.typography.body,
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  button: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
  },
  buttonText: {
    ...theme.typography.label,
    color: theme.colors.onPrimary,
  },
  icon: {
    marginLeft: theme.spacing.xs,
  }
});
