//импортируем библиотеки dotenv и grammy
require('dotenv').config()
const { Bot, GrammyError, HttpError } = require('grammy')

const bot = new Bot(process.env.BOT_API_KEY) //подключаем API бота

// !очень важен порядок обработчиков

bot.api.setMyCommands([
	{
		command: 'start',
		description: 'Старт бота',
	},
	{
		command: 'help',
		description: 'Возвращает список команд',
	},
	{
		command: 'site',
		description: 'Отправляет в чат ссылку на сайт октагона',
	},
	{
		command: 'creator',
		description: 'отправляет в чат ФИО',
	},
])

// *название команды пишем без '/'
bot.command('start', async ctx => {
	await ctx.reply('Здравствуйте. Выберете команду из списка меню:') //при команде /start выводит текст
})

bot.command('help', async ctx => {
	await ctx.reply(
		'/start - Старт бота\n/site - Отправляет в чат ссылку на сайт октагона\n/creator - отправляет в чат ФИО'
	)
})

bot.command('site', async (ctx) => {
	await ctx.reply('Ссылка на сайт Octagon: https://students.forus.ru/business')
})

bot.command('creator', async (ctx) => {
	await ctx.reply('Зачем тебе свое ФИО? Ладно, держи:\nЛазуткин Илья Константинович')
})

// TODO проверка на различные ошибки
bot.catch(err => {
	const ctx = err.ctx
	console.log(`Error while handling update ${ctx.update.update_id}:`)
	const e = err.error

	if (e instanceof GrammyError) {
		console.error('Error in request:', e.description)
	} else if (e instanceof HttpError) {
		console.error('Could not contact Telegram:', e)
	} else {
		console.error('Unknown error', e)
	}
})

bot.start() //старт бота
