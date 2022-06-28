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
    const todos = await this.appService.getAll();
    await ctx.reply(showList(todos));
  }

  @Hears('🌀 Создать задачу')
  async createTask(ctx: Context) {
    await ctx.reply('Напишите название задачи: ');
    ctx.session.type = 'create';
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
    let todos;
    switch (ctx.session.type) {
      case 'create':
        todos = await this.appService.createTask(message);
        if (!todos) {
          await ctx.reply('Задачи с таким ID не найдено');
          return;
        }
        await ctx.reply(showList(todos));
        break;
      case 'done':
        todos = await this.appService.doneTask(Number(message));
        if (!todos) {
          await ctx.reply('Задачи с таким ID не найдено');
          return;
        }
        await ctx.reply(showList(todos));
        break;
      case 'edit':
        const [taskId, taskName] = message.split(' | ');
        todos = await this.appService.editTask(Number(taskId), taskName);
        if (!todos) {
          await ctx.reply('Задачи с таким ID не найдено');
          return;
        }
        await ctx.reply(showList(todos));
        break;
      case 'delete':
        todos = await this.appService.deleteTask(Number(message));
        if (!todos) {
          await ctx.reply('Задачи с таким ID не найдено');
          return;
        }
        await ctx.reply(showList(todos));
        break;
      default:
        return;
    }
  }
}
