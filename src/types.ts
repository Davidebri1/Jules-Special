export type MessageSender = 'user' | 'orchestrator';

export interface ActionWidgetProps {
  id: string;
  title: string;
  description: string;
  cost: number;
}

export interface Message {
  id: string;
  sender: MessageSender;
  text: string;
  widget?: ActionWidgetProps;
  analysis?: string[]; // Used by orchestrator to break down steps
}

export interface ExpertModel {
  id: string;
  name: string;
  lens: string;
  costMultiplier: number; // e.g., 1.0, 1.5
}
