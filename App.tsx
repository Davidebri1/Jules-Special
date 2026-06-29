import React, { useState, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, KeyboardAvoidingView, Platform, FlatList, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { theme } from './src/theme/theme';
import { TopBar } from './src/components/TopBar';
import { ChatInput } from './src/components/ChatInput';
import { ChatMessage } from './src/components/ChatMessage';
import { CollideModal } from './src/components/CollideModal';
import { Message, ExpertModel, ActionWidgetProps } from './src/types';

const INITIAL_GREETING: Message = {
  id: 'msg-0',
  sender: 'orchestrator',
  text: 'What would you like to achieve today?',
};

const MOCK_MODELS: ExpertModel[] = [
  { id: 'mod-1', name: 'Creative Director', lens: 'Focuses on brand narrative and visual edge.', costMultiplier: 1.2 },
  { id: 'mod-2', name: 'Financial Analyst', lens: 'Focuses on monetization and unit economics.', costMultiplier: 1.0 },
  { id: 'mod-3', name: 'Tech Architect', lens: 'Focuses on scalability and stack.', costMultiplier: 1.5 },
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_GREETING]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<ActionWidgetProps | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = (text: string) => {
    const newUserMsg: Message = { id: Date.now().toString(), sender: 'user', text };
    setMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);

    // Simulate Orchestrator reasoning delay
    setTimeout(() => {
      setIsTyping(false);
      const orchestratorResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'orchestrator',
        text: 'Starting a business is a great goal. Let\'s break this down into actionable steps to get you from idea to launch without the overwhelm.',
        analysis: [
          'Market Research & Feasibility',
          'Brand Identity & Naming',
          'Business Plan & Economics'
        ],
        widget: {
          id: 'wid-1',
          title: 'Generate Business Name & Concept',
          description: 'A comprehensive starting package including name ideas, core value proposition, and a preliminary lean canvas.',
          cost: 5
        }
      };
      setMessages(prev => [...prev, orchestratorResponse]);
    }, 1500);
  };

  const handleWidgetPress = (widgetId: string) => {
    // Find the widget from messages (simplified for prototype)
    for (const msg of messages) {
      if (msg.widget && msg.widget.id === widgetId) {
        setSelectedWidget(msg.widget);
        break;
      }
    }
  };

  const handleCollideConfirm = (selectedModelIds: string[], totalCost: number) => {
    setSelectedWidget(null);
    Alert.alert(
      "Workflow Initiated",
      `Generating alternatives using ${selectedModelIds.length} models for ${totalCost} Credits. (Mocked Action)`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <TopBar />

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.chatContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ChatMessage message={item} onWidgetPress={handleWidgetPress} />
            )}
            contentContainerStyle={styles.listContent}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
          {isTyping && (
            <View style={styles.typingIndicator}>
              <ActivityIndicator color={theme.colors.primary} size="small" />
            </View>
          )}
        </View>

        <ChatInput onSend={handleSend} disabled={isTyping} />
      </KeyboardAvoidingView>

      {selectedWidget && (
        <CollideModal
          visible={!!selectedWidget}
          onClose={() => setSelectedWidget(null)}
          widget={selectedWidget}
          models={MOCK_MODELS}
          onConfirm={handleCollideConfirm}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  listContent: {
    paddingVertical: theme.spacing.md,
  },
  typingIndicator: {
    padding: theme.spacing.md,
    alignItems: 'flex-start',
    marginLeft: theme.spacing.xxl, // align roughly with orchestrator text
  }
});
