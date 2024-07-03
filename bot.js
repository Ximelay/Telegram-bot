//импортируем библиотеки dotenv и grammy
require('dotenv').config()

const { Bot, GrammyError, HttpError } = require('grammy')
const qrcode = require('qrcode')
const { createCanvas, loadImage } = require('canvas')

const mysql = require('mysql2/promise')
const setIntervalAsync = require('set-interval-async/dynamic')

const puppeteer = require('puppeteer');

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
		command: 'creator',
		description: 'отправляет в чат ФИО',
	},
	{
		command: 'site',
		description: 'Отправляет в чат ссылку на сайт октагона',
	},
	{
		command: 'qr',
		description: 'Отправляет QR-код на указанную ссылку',
	},
	{
		command: 'webscr',
		description: 'Отправляет в чат скриншот указанного сайта',
	},
	{
		command: 'name',
		description: 'Отправляет в чат ваше имя',
	},
])

// *название команды пишем без '/'
bot.command('start', async ctx => {
	await ctx.reply('Здравствуйте. Выберете команду из списка меню:') //при команде /start выводит текст
})

bot.command('qr', async ctx => {
	// Проверяем, что пользователь отправил ссылку
	if (!ctx.message.text.includes('http')) {
		ctx.reply('Пожалуйста, отправьте ссылку для генерации QR-кода.')
		return
	}

	bot.hears('creator_ximelay', async ctx => {
		if (ctx.from.id === tgId) {
			await ctx.reply(
				'Привет, Ximelay. Скоро этот раздел будет исключительно для тебя'
			)
		} else {
			await ctx.reply('Эта команда исключительно для админа(')
		}
	})

	// Извлекаем ссылку из сообщения
	const link = ctx.message.text.replace('/qr', '').trim()

	try {
		// Генерируем QR-код из ссылки
		const qrDataURL = await qrcode.toDataURL(link)

		// Создаем изображение QR-кода
		const canvas = createCanvas(200, 200)
		const ctx2d = canvas.getContext('2d')

		const img = await loadImage(qrDataURL) // Загружаем изображение

		ctx2d.drawImage(img, 0, 0)

		// Отправляем изображение
		ctx.replyWithPhoto({ source: canvas.toBuffer() })
	} catch (error) {
		console.error('Ошибка при создании QR-кода:', error)
		ctx.reply('Произошла ошибка при создании QR-кода.')
	}
}) 

bot.command('webscr', async ctx => {
	// Получаем веб-адрес из сообщения пользователя
	const url = ctx.message.text.split(' ')[1]

	// Проверяем наличие веб-адреса
	if (!url) {
		ctx.reply('Пожалуйста, укажите веб-адрес')
		return
	}

	// Запускаем браузер
	const browser = await puppeteer.launch()

	// Открываем новую страницу
	const page = await browser.newPage()

	try {
		// Переходим по указанному веб-адресу
		await page.goto(url)

		// Создаем скриншот страницы
		const screenshot = await page.screenshot()

		// Отправляем скриншот пользователю
		await ctx.replyPhoto({ source: screenshot })
	} catch (error) {
		console.error(error)
		ctx.reply('Произошла ошибка при обработке вашего запроса')
	} finally {
		// Закрываем браузер после завершения операции
		await browser.close()
	}
})

bot.command('help', async ctx => {
	await ctx.reply(
		'/start - Старт бота\n/site - Отправляет в чат ссылку на сайт октагона\n/creator - отправляет в чат ФИО\n/qr - Отправляет QR-код на указанную ссылку\n/webscr - Отправляет в чат скриншот указанного сайта'
	)
})

bot.command('creator', async ctx => {
	await ctx.reply(
		'Зачем тебе свое ФИО? Ладно, держи:\nЛазуткин Илья Константинович'
	)
})
// TODO Команда проверка, не обращайте внимание
// bot.command('name', async ctx => {
// 	if (ctx.from.id === 1196691577)
// 	{
// 		await ctx.reply('Привет, Руслан)')
// 	}
// })

bot.command('site', async (ctx) => {
	await ctx.reply('Ссылка на сайт Octagon: https://students.forus.ru/business')
})

async function main() {
	// Подключение к базе данных
	const connection = await mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'qwerty',
		database: 'Users',
		waitForConnections: true,
		connectionLimit: 10,
		queueLimit: 0,
		charset: 'utf8mb4',
	})

	// Функция для обновления записи в таблице Users при получении сообщения от пользователя
	async function updateUserLastMessage(userID) {
		try {
			const [rows] = await connection.execute(
				'INSERT INTO Users (ID, lastMessage) VALUES (?, NOW()) ON DUPLICATE KEY UPDATE lastMessage = NOW()',
				[userID]
			)
			console.log(`Запись пользователя ${userID} обновлена успешно.`)
		} catch (error) {
			console.error('Ошибка при обновлении записи пользователя:', error)
		}
	}

	// Обработчик для события "message" с вызовом updateUserLastMessage
	bot.on('message', async ctx => {
		const userID = ctx.message.from.id
		await updateUserLastMessage(userID)
	})

	// Функция для проверки даты последнего сообщения пользователей и отправки "randomItem"
	async function checkLastMessages() {
		try {
			const [rows] = await connection.execute(
				'SELECT ID, lastMessage FROM Users'
			)

			const currentDate = new Date()

			for (const row of rows) {
				const userID = row.ID
				const lastMessageDate = new Date(row.lastMessage)

				// Разница во времени между текущей датой и датой последнего сообщения пользователя
				const timeDiff = currentDate.getTime() - lastMessageDate.getTime()

				if (timeDiff > 2 * 24 * 60 * 60 * 1000) {
					await bot.api.sendMessage(userID, 'Вы тут?')
					console.log(`Отправлено сообщение "Вы тут?" пользователю ${userID}`)
				}
			}
		} catch (error) {
			console.error(
				'Ошибка при проверке последних сообщений пользователей:',
				error
			)
		}
	}
	// Создание таймера для checkLastMessages
	setInterval(checkLastMessages, 24 * 60 * 60 * 1000)

	// TODO проверка на различные ошибки
	bot.catch(err => {
		const ctx = err.ctx
		console.log(`Ошибка при обработке обновления ${ctx.update.update_id}:`)
		const e = err.error

		if (e instanceof GrammyError) {
			console.error('Ошибка в запросе:', e.description)
		} else if (e instanceof HttpError) {
			console.error('Не удалось связаться с Telegram:', e)
		} else {
			console.error('Неизвестная ошибка', e)
		}
	})

	bot.start() //старт бота
}
// Вызываем функцию main()
main().catch(console.error);

