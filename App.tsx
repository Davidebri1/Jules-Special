import React, { useState, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, KeyboardAvoidingView, Platform, FlatList, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { theme } from './src/theme/theme';
import { TopBar } from './src/components/TopBar';
import { ChatInput } from './src/components/ChatInput';
import { ChatMessage } from './src/components/ChatMessage';
import { EnsembleModal } from './src/components/EnsembleModal';
import { WallpaperSwitcher } from './src/components/WallpaperSwitcher';
import { Message, ExpertModel, Wallpaper, ModelResponse } from './src/types';

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showEnsembleModal, setShowEnsembleModal] = useState(false);
  const [activeWallpaperId, setActiveWallpaperId] = useState(WALLPAPERS[0].id);
  const [showWallpapers, setShowWallpapers] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  const activeWallpaper = WALLPAPERS.find(wp => wp.id === activeWallpaperId) || WALLPAPERS[0];

  const handleSend = (text: string) => {
    const newUserMsg: Message = { id: Date.now().toString(), sender: 'user', text };
    setMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);

    // Standard open-ended single-model response
    setTimeout(() => {
      setIsTyping(false);
      const orchestratorResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'orchestrator',
        text: 'I understand. Let me help you with that. Here are some thoughts based on what you asked...',
      };
      setMessages(prev => [...prev, orchestratorResponse]);
    }, 1500);
  };

  const handleOrchestrateConfirm = (selectedModelIds: string[], totalCost: number) => {
    setShowEnsembleModal(false);

    // We append a system message indicating what is happening,
    // since the user hasn't typed anything new yet but triggered an ensemble action.
    const initiateMsg: Message = {
        id: Date.now().toString(),
        sender: 'orchestrator',
        text: `Consulting ${selectedModelIds.length} expert models for the current context. (Cost: ${totalCost} Credits)`
    };
    setMessages(prev => [...prev, initiateMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      const generatedResponses: ModelResponse[] = selectedModelIds.map(id => {
        const model = MOCK_MODELS.find(m => m.id === id)!;
        return {
          modelId: model.id,
          modelName: model.name,
          text: `[Response from ${model.name}]\nAnalyzing your latest context through the lens of ${model.lens.toLowerCase()} Here is my perspective.`
        };
      });

      const multiModelMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'models',
        text: '',
        modelResponses: generatedResponses
      };

      setMessages(prev => [...prev, multiModelMessage]);
    }, 2000);
  };

  return (
    <View style={styles.webWrapper}>
      <SafeAreaView style={[styles.container, { backgroundColor: activeWallpaper.value }]}>
        <StatusBar style="light" />
        <TopBar title="Maestro" onWallpaperPress={() => setShowWallpapers(true)} />

        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.chatContainer}>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <ChatMessage message={item} />}
              contentContainerStyle={styles.listContent}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />
            {isTyping && (
              <View style={styles.typingIndicator}>
                <ActivityIndicator color={theme.colors.primary} size="small" />
              </View>
            )}
          </View>

          <ChatInput
            onSend={handleSend}
            onOpenEnsemble={() => setShowEnsembleModal(true)}
            disabled={isTyping}
          />
        </KeyboardAvoidingView>

        <EnsembleModal
          visible={showEnsembleModal}
          onClose={() => setShowEnsembleModal(false)}
          widget={{ id: 'current-context', title: 'Evaluate Context', description: 'Select models to evaluate the ongoing conversation.', cost: 10 }}
          models={MOCK_MODELS}
          onConfirm={handleOrchestrateConfirm}
        />

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
    </View>
  );
}

const styles = StyleSheet.create({
  webWrapper: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: Platform.OS === 'web' ? 'center' : 'stretch',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 480 : '100%',
    shadowColor: '#6366f1',
    shadowOpacity: Platform.OS === 'web' ? 0.2 : 0,
    shadowRadius: 50,
    elevation: 0,
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
