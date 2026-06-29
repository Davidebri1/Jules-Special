import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { ModelResponse } from '../types';

interface Props {
  responses: ModelResponse[];
}

const windowWidth = Dimensions.get('window').width;

export const MultiModelGrid: React.FC<Props> = ({ responses }) => {
  const [columns, setColumns] = useState<1 | 2 | 3>(3); // Default to 3 for max view

  if (!responses || responses.length === 0) return null;

  // Calculate card width based on available space minus padding/margins
  const containerPadding = theme.spacing.md * 2;
  const cardMargin = theme.spacing.sm;
  const availableWidth = windowWidth - containerPadding - 32; // 32 for some extra breathing room

  const getCardWidth = () => {
    if (columns === 1) return '100%';
    // Subtract margins to fit perfectly
    const marginSpace = cardMargin * (columns - 1);
    return (availableWidth - marginSpace) / columns;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Model Evaluation ({responses.length})</Text>
        <View style={styles.controls}>
          {[1, 2, 3].map((col) => (
            <TouchableOpacity
              key={col}
              style={[styles.colBtn, columns === col && styles.colBtnActive]}
              onPress={() => setColumns(col as 1|2|3)}
            >
              <Text style={[styles.colBtnText, columns === col && styles.colBtnTextActive]}>{col}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Use ScrollView only for very small screens or excessive content, otherwise flexWrap handles it */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {responses.map((resp, i) => (
            <View
              key={resp.modelId}
              style={[
                styles.card,
                {
                  width: getCardWidth(),
                  marginRight: (i + 1) % columns !== 0 && columns !== 1 ? cardMargin : 0
                }
              ]}
            >
              <View style={styles.cardHeader}>
                <Ionicons name="cube-outline" size={14} color={theme.colors.primary} />
                <Text style={styles.cardTitle} numberOfLines={1}>{resp.modelName}</Text>
              </View>
              {/* Adjust lines based on columns to keep cards uniform and small in 3-col view */}
              <Text style={styles.cardText} numberOfLines={columns === 3 ? 4 : 8}>{resp.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
    backgroundColor: 'rgba(20,20,20,0.6)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.label,
    color: theme.colors.primary,
  },
  controls: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  colBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  colBtnActive: {
    backgroundColor: theme.colors.primary,
  },
  colBtnText: {
    ...theme.typography.caption,
  },
  colBtnTextActive: {
    color: theme.colors.onPrimary,
  },
  scrollContent: {
    paddingBottom: theme.spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: 4,
  },
  cardTitle: {
    ...theme.typography.caption,
    marginLeft: 4,
    color: theme.colors.text,
    flex: 1,
  },
  cardText: {
    ...theme.typography.caption,
    fontSize: 12,
    color: theme.colors.textMuted,
  }
});
