import { Markup } from 'telegraf';

export function actionButtons() {
  return Markup.keyboard(
    [
      Markup.button.callback('📃 Список дел', 'list'),
      Markup.button.callback('🖋️ Редактировать', 'edit'),
      Markup.button.callback('❌ Удалить', 'delete'),
    ],
    {
      columns: 3,
    },
  );
}
