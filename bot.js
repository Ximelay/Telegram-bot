//импортируем библиотеки dotenv и grammy
require('dotenv').config()
const { Bot } = require('grammy')

const bot = new Bot(process.env.BOT_API_KEY) //подключаем API бота

// !очень важен порядок обработчиков

// *название команды пишем без '/'
bot.command('start', async ctx => {
	await ctx.reply('Привет, октагон!') //при команде /start выводит текст
})

bot.command('clear', async ctx => {
	// Проверяем, имеет ли пользователь права на удаление сообщений (например, администратор или создатель чата)
	if (ctx.from.id == tgId) {
		try {
			// Получаем идентификатор чата
			const chatId = ctx.chat.id
			// Получаем список всех сообщений в чате
			const messages = await getChatHistory(chatId)
			// Проходимся по каждому сообщению и удаляем его
			for (const message of messages) {
				await deleteMessage(chatId, message.message_id)
			}
			await ctx.reply('Chat cleared successfully')
		} catch (error) {
			console.error('Error while clearing chat:', error)
			await ctx.reply('Error while clearing chat')
		}
	} else {
		await ctx.reply('You do not have permission to clear the chat.')
	}
})

bot.start() //старт бота