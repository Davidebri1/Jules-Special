import React, { useState, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, KeyboardAvoidingView, Platform, FlatList, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { theme } from './src/theme/theme';
import { TopBar } from './src/components/TopBar';
import { ChatInput } from './src/components/ChatInput';
import { ChatMessage } from './src/components/ChatMessage';
import { CollideModal } from './src/components/CollideModal';
import { WallpaperSwitcher } from './src/components/WallpaperSwitcher';
import { Message, ExpertModel, ActionWidgetProps, Wallpaper, ModelResponse } from './src/types';

const INITIAL_GREETING: Message = {
  id: 'msg-0',
  sender: 'orchestrator',
  text: 'What would you like to explore or achieve today?',
};

const WALLPAPERS: Wallpaper[] = [
  { id: 'wp-1', name: 'Obsidian (Default)', type: 'color', value: '#0A0A0A' },
  { id: 'wp-2', name: 'Deep Indigo', type: 'color', value: '#1a1b41' },
  { id: 'wp-3', name: 'Forest Night', type: 'color', value: '#0d2818' },
  { id: 'wp-4', name: 'Abyssal Blue', type: 'color', value: '#001233' },
];

const MOCK_MODELS: ExpertModel[] = [
  { id: 'mod-1', name: 'Creative Director', lens: 'Narrative & visual edge.', costMultiplier: 1.2 },
  { id: 'mod-2', name: 'Financial Analyst', lens: 'Monetization & economics.', costMultiplier: 1.0 },
  { id: 'mod-3', name: 'Tech Architect', lens: 'Scalability & stack.', costMultiplier: 1.5 },
  { id: 'mod-4', name: 'Legal Counsel', lens: 'Compliance & risk.', costMultiplier: 1.8 },
  { id: 'mod-5', name: 'Marketing Guru', lens: 'Growth & positioning.', costMultiplier: 1.1 },
  { id: 'mod-6', name: 'Academic Researcher', lens: 'Deep dive & citations.', costMultiplier: 1.3 },
  { id: 'mod-7', name: 'Life Coach', lens: 'Motivation & habits.', costMultiplier: 0.8 },
  { id: 'mod-8', name: 'Data Scientist', lens: 'Metrics & patterns.', costMultiplier: 1.4 },
  { id: 'mod-9', name: 'Copywriter', lens: 'Tone & messaging.', costMultiplier: 1.0 },
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_GREETING]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<ActionWidgetProps | null>(null);
  const [activeWallpaperId, setActiveWallpaperId] = useState(WALLPAPERS[0].id);
  const [showWallpapers, setShowWallpapers] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  const activeWallpaper = WALLPAPERS.find(wp => wp.id === activeWallpaperId) || WALLPAPERS[0];

  const handleSend = (text: string) => {
    const newUserMsg: Message = { id: Date.now().toString(), sender: 'user', text };
    setMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const orchestratorResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'orchestrator',
        text: 'I can help you explore that. Here is a breakdown of how we might approach it:',
        analysis: [
          'Initial scoping and research',
          'Evaluating technical or creative constraints',
          'Executing the proposed solution'
        ],
        widget: {
          id: 'wid-1',
          title: 'Deep Dive Analysis',
          description: 'Generate a comprehensive report covering all facets of your request.',
          cost: 10
        }
      };
      setMessages(prev => [...prev, orchestratorResponse]);
    }, 1500);
  };

  const handleWidgetPress = (widgetId: string) => {
    for (const msg of messages) {
      if (msg.widget && msg.widget.id === widgetId) {
        setSelectedWidget(msg.widget);
        break;
      }
    }
  };

  const handleCollideConfirm = (selectedModelIds: string[], totalCost: number) => {
    setSelectedWidget(null);
    setIsTyping(true);

    // Simulate multi-model response
    setTimeout(() => {
      setIsTyping(false);

      const generatedResponses: ModelResponse[] = selectedModelIds.map(id => {
        const model = MOCK_MODELS.find(m => m.id === id)!;
        return {
          modelId: model.id,
          modelName: model.name,
          text: `[Simulated response from ${model.name}]\nBased on the lens of ${model.lens.toLowerCase()}, here is the tailored output for your request. This approach prioritizes specific methodologies relevant to this domain.`
        };
      });

      const multiModelMessage: Message = {
        id: Date.now().toString(),
        sender: 'models',
        text: '',
        modelResponses: generatedResponses
      };

      setMessages(prev => [...prev, multiModelMessage]);
    }, 2000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeWallpaper.value }]}>
      <StatusBar style="light" />
      <TopBar title="Omni" onWallpaperPress={() => setShowWallpapers(true)} />

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

      <WallpaperSwitcher
        visible={showWallpapers}
        onClose={() => setShowWallpapers(false)}
        wallpapers={WALLPAPERS}
        selectedId={activeWallpaperId}
        onSelect={(id) => {
          setActiveWallpaperId(id);
          setShowWallpapers(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginLeft: theme.spacing.xxl,
  }
});
