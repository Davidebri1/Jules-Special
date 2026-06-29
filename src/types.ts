export type MessageSender = 'user' | 'orchestrator' | 'models';

export interface ActionWidgetProps {
  id: string;
  title: string;
  description: string;
  cost: number;
}

export interface ModelResponse {
  modelId: string;
  modelName: string;
  text: string;
}

export interface Message {
  id: string;
  sender: MessageSender;
  text: string;
  widget?: ActionWidgetProps;
  analysis?: string[];
  modelResponses?: ModelResponse[];
}

export interface ExpertModel {
  id: string;
  name: string;
  lens: string;
  costMultiplier: number;
}

export interface Wallpaper {
  id: string;
  name: string;
  value: string; // color hex or gradient placeholder
  type: 'color' | 'image';
}
