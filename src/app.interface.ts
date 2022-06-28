import { Context as ContextTelegraf } from 'telegraf';

export interface Context extends ContextTelegraf {
  session: {
    type?: 'done' | 'edit' | 'delete';
  };
}

export interface ITodo {
  id: number;
  name: string;
  isCompleted: boolean;
}
