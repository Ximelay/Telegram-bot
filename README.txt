<!-- ОБОЗНАЧЕНИЯ КОММЕНТАРИЕВ!!!
!текст! - очень важная информация для текста
?код? - важная информация для кода
TODO проверка TODO - различные проверки кода
*код - объяснение к нему* - пояснения за код
QWERTY - другое -->

<!-- !очень важен порядок обработчиков -->

<!-- bot.on([':media', '::url'], async (ctx) => {
*await ctx.reply('Получил ссылку')
*при вводе любых символов выведет данный текст. 
?Можно не писать 'message'
!Если есть указатель типа (например photo), то отреагирует при фотографии. Также можно объединять команды в массивы
}) -->

<!-- *создаём меню из команд, где: 'command' - название команды, а 'description' - описание команды
?Также надо учитывать, что нельзя использовать буквы верхнего регистра A-Z, иначе ошибка 200

bot.api.setMyCommands([
	{
		command: 'start',
		description: 'старт бота',
	},
	{
		command: 'mod',
		description: 'настроение',
	},
]) -->

 <!-- ?'msg' позволяет найти из сообщения любые символы
при команде /start выводит текст
 bot.on('msg', async ctx => {
  ?информация об сообщении (id, date и др.)
 	console.log(ctx.msg)
  ?информация об пользователе
 	console.log(ctx.from)
  ?информация об боте
 	console.log(ctx.me)
 }) -->

 <!-- bot.command('start', async ctx => {
 	await ctx.reply('Привет! Выбери команды', {
 	?reply_parameters: {message_id: ctx.msg.message_id}
*reply_parameters: {message_id: ctx.msg.message_id}
*позволяет отвечать на конкретное сообщение пользователя (типичный ответ в мессенджерах)
 	}) при команде /start выводит текст
 }); -->

<!-- bot.command('start', async ctx => {
 	await ctx.reply('Привет! Я бот. Тг канал: <a href="#">ссылка</a>', {
 		parse_mode: 'HTML'}) * выводит ссылку в HTML разметке
 }); -->

 <!-- ?await ctx.react('✍') Ставит реакцию на наше сообщение

 *название команды пишем без '/'

bot.command('start', async ctx => {
	await ctx.react('❤‍🔥')
	await ctx.reply('Привет! Я бот. Тг канал: <a href="#">ссылка</a>', {
		parse_mode: 'HTML',
	})
}) -->

<!-- bot.command('mod', async ctx => {
	const moodKeyboard = new Keyboard()
		.text('Хорошо')
		.row()
		.text('Норм')
		.row()
		.text('Плохо')
		.resized()
    * создаст клавиатуру, где с каждой новой строки будет выведено новое слово с размерами по содержимому
	await ctx.reply('Как настроение?', {
		reply_markup: moodKeyboard,
	})
}) -->

<!-- bot.hears('Хорошо', async ctx => {
	await ctx.reply('Класс!', {
		reply_markup: { remove_keyboard: true },
	})
})

*Если пользователь введет в сообщение 'ID', то бот выдаст его id.
 bot.hears('ID', async ctx => {
 	await ctx.reply(`Ваш ID: ${ctx.from.id}`)
 }) -->

<!-- *реагирование на конкретное сообщение. Если вставим /писец/, то бот найдет данное слово из любых символов
bot.hears(['пинг', 'еще пинг'], async ctx => {
await ctx.reply('понг')
})

 ?добавляем несколько команд, которые будут реализовывать одно и тоже действие
bot.command(['say_hello', 'hello', 'say_hi'], async ctx => {
await ctx.reply('Hello')
}) -->

<!-- bot.catch(err => {
	 TODO проверка на различные ошибки
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

bot.start() старт бота -->
