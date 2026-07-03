import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

interface ChatInputProps {
  onSend: (text: string) => void;
  onOpenEnsemble: () => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, onOpenEnsemble, disabled }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.inputWrapper, disabled && styles.disabledWrapper]}>
        <TouchableOpacity
          style={styles.ensembleButton}
          onPress={onOpenEnsemble}
          disabled={disabled}
        >
          <Ionicons name="apps-outline" size={24} color={theme.colors.textMuted} />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Message Maestro..."
          placeholderTextColor={theme.colors.textMuted}
          value={text}
          onChangeText={setText}
          multiline
          editable={!disabled}
        />

        <TouchableOpacity
          style={[styles.sendButton, (!text.trim() || disabled) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!text.trim() || disabled}
        >
          <Ionicons name="arrow-up" size={20} color={text.trim() && !disabled ? theme.colors.onPrimary : theme.colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    backgroundColor: 'transparent',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  disabledWrapper: {
    opacity: 0.7,
  },
  ensembleButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.xs,
  },
  input: {
    flex: 1,
    ...theme.typography.body,
    maxHeight: 100,
    minHeight: 40,
    paddingTop: 10,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.surfaceBright,
  },
});
