import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
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
        <TextInput
          style={styles.input}
          placeholder="I want to start a business..."
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
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  disabledWrapper: {
    opacity: 0.7,
  },
  input: {
    flex: 1,
    ...theme.typography.body,
    maxHeight: 100,
    minHeight: 40,
    paddingTop: 10, // Adjust for multiline alignment
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
