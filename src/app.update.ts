import {
  Action,
  Ctx,
  Hears,
  InjectBot,
  Message,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { actionButtons } from './app.buttons';
import { AppService } from './app.service';
import { showList } from './app.utils';
import { Context, ITodo } from './app.interface';

const todos: ITodo[] = [
  {
    id: 1,
    name: 'Buy goods',
    isCompleted: false,
  },
  {
    id: 2,
    name: 'Go to walk',
    isCompleted: false,
  },
  {
    id: 3,
    name: 'Travel',
    isCompleted: true,
  },
];

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Что ты хочешь сделать?', actionButtons());
  }

  @Hears('📃 Список задач')
  async listTask(ctx: Context) {
    await ctx.reply(showList(todos));
  }

  @Hears('✅ Завершить')
  async doneTask(ctx: Context) {
    await ctx.reply('Напишите ID задачи: ');
    ctx.session.type = 'done';
  }

  @Hears('🖋️ Редактировать')
  async editTask(ctx: Context) {
    await ctx.replyWithHTML(
      'Напишите ID задачи и новое название в формате: \n\n <b>ID | Новое название</b> ',
    );
    ctx.session.type = 'edit';
  }

  @Hears('❌ Удалить')
  async deleteTask(ctx: Context) {
    await ctx.reply('Напишите ID задачи, которую хотите удалить: ');
    ctx.session.type = 'delete';
  }

  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx: Context) {
    let todo;
    switch (ctx.session.type) {
      case 'done':
        todo = todos.find((t) => t.id === Number(message));
        if (!todo) {
          await ctx.reply('Задачи с таким ID не найдено');
          return;
        }
        todo.isCompleted = !todo.isCompleted;
        await ctx.reply(showList(todos));
        break;
      case 'edit':
        const [taskId, taskName] = message.split(' | ');
        todo = todos.find((t) => t.id === Number(taskId));
        if (!todo) {
          await ctx.reply('Задачи с таким ID не найдено');
          return;
        }
        todo.name = taskName;
        await ctx.reply(showList(todos));
        break;
      case 'delete':
        todo = todos.find((t) => t.id === Number(message));
        if (!todo) {
          await ctx.reply('Задачи с таким ID не найдено');
          return;
        }
        await ctx.reply(
          showList(todos.filter((todo) => todo.id != Number(message))),
        );
        break;
      default:
        return;
    }
  }
}
