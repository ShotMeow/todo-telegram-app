import { ITodo } from './app.interface';

export const showList = (todos: ITodo[]) =>
  `Ваш список задач: \n\n${todos
    .map((todo) => (todo.isCompleted ? '✅ ' : '⏺️ ') + todo.name + '\n\n')
    .join('')}`;
