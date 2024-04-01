//импортируем библиотеки dotenv и grammy
require('dotenv').config()
const { Bot } = require('grammy')

const bot = new Bot(process.env.BOT_API_KEY) //подключаем API бота

// !очень важен порядок обработчиков

// *название команды пишем без '/'
bot.command('start', async ctx => {
	await ctx.reply('Привет, октагон!') //при команде /start выводит текст
})

bot.start() //старт бота