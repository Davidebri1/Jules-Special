import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { Message } from '../types';
import { ActionWidget } from './ActionWidget';
import { MultiModelGrid } from './MultiModelGrid';

interface ChatMessageProps {
  message: Message;
  onWidgetPress?: (widgetId: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onWidgetPress }) => {
  const isUser = message.sender === 'user';
  const isModels = message.sender === 'models';

  if (isModels && message.modelResponses) {
    return (
      <View style={styles.container}>
        <MultiModelGrid responses={message.modelResponses} />
      </View>
    );
  }

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.orchestratorContainer]}>
      {!isUser && (
        <View style={styles.avatar}>
          <Ionicons name="planet-outline" size={24} color={theme.colors.primary} />
        </View>
      )}

      <View style={styles.contentContainer}>
        {isUser ? (
          <View style={styles.userBubble}>
            <Text style={styles.userText}>{message.text}</Text>
          </View>
        ) : (
          <View style={styles.orchestratorBubble}>
            {!!message.text && <Text style={styles.orchestratorText}>{message.text}</Text>}

            {message.analysis && message.analysis.length > 0 && (
              <View style={styles.analysisContainer}>
                <Text style={styles.analysisTitle}>Analysis</Text>
                {message.analysis.map((step, index) => (
                  <Text key={index} style={styles.analysisStep}>• {step}</Text>
                ))}
              </View>
            )}

            {message.widget && (
              <View style={styles.widgetContainer}>
                <ActionWidget
                  widget={message.widget}
                  onPress={() => onWidgetPress?.(message.widget!.id)}
                />
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  orchestratorContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  contentContainer: {
    maxWidth: '85%',
  },
  userBubble: {
    backgroundColor: theme.colors.surfaceBright,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderBottomRightRadius: theme.borderRadius.sm,
  },
  orchestratorBubble: {
    paddingTop: theme.spacing.xs,
  },
  userText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  orchestratorText: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  analysisContainer: {
    backgroundColor: 'rgba(28, 27, 27, 0.7)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  analysisTitle: {
    ...theme.typography.label,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  analysisStep: {
    ...theme.typography.body,
    fontSize: 14,
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  widgetContainer: {
    marginTop: theme.spacing.sm,
  }
});
