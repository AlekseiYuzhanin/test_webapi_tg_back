const TelegramApi = require('node-telegram-bot-api')
const express = require('express')
const cors = require('cors')

require('dotenv').config()

const token = '6643030679:AAH7xkgdakwi3ARPbl_TBMAoYiifVzSzF88';
const bot = new TelegramApi(token, {polling: true});
const app = express()

app.use(express.json())
app.use(cors())

let chatIdGlobal = 0;
let globalUserName = ''
bot.on('message', async (msg) => {
    try{
        if (msg.text === '/start') {
            const chatId = msg.chat.id;
            chatIdGlobal = chatId;
            const text = msg.text;
            if (msg.chat?.id !== -4275066986) {
                await bot.sendPhoto(chatId, 'image_bot.jpg', {
                    caption: 'Привет, для начала ознакомься с принципами работы.',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {text: 'Информация о работе📖', url: 'https://telegra.ph/Korotko-o-rabote-v-CENTRAL-TEAM-06-22'},
                                {text: 'Согласен с информацией✅', callback_data: 'approve'}
                            ]
                        ],
                    },
                });
            }
        }
    } catch (e){
        console.log(e)
    }

});

bot.on('callback_query', async query => {
    try{
        msgId = query.message?.chat?.id;
        if(query.data === 'approve'){
            await bot.sendMessage(msgId, 'Окей, давайте заполним форму', {
                reply_markup: {
                    keyboard: [[{text: 'Заполнить форму', web_app: {url: 'https://glittering-tulumba-d1e9aa.netlify.app/form'}}]],
                    remove_keyboard: true
                }
            });
        }

        if(query.data === 'submit'){
            await bot.sendMessage(chatIdGlobal, 'Добро пожаловать! Ваша заявка успешно одобрена, благодарим вас за терпение.', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {text: 'Связь с админом', url: 'https://t.me/bruto_333'},
                            {text: 'Отбор новичков', url: 'https://t.me/+RYknmVbix4VhZTRi'}
                        ]
                    ]
                }
            })

            await bot.editMessageText(`Заявка пользователя @${globalUserName} принята \n\nЗаявка:\n<blockquote>${query.message.text}</blockquote>\n\nЗаявку принял: @${query.from.username}`, {
                parse_mode: 'HTML',
                chat_id: query.message.chat.id,
                message_id: query.message.message_id
            })
        }

        if(query.data === 'decline'){
            await bot.editMessageText(`Заявка пользователя @${globalUserName} отклонена \n\nЗаявка:\n<blockquote>${query.message.text}</blockquote>\n\nЗаявку отклонил: @${query.from.username}`, {
                parse_mode: 'HTML',
                chat_id: query.message.chat.id,
                message_id: query.message.message_id
            })
        }
    } catch (e) {
        console.log(e)
    }
});

bot.on('web_app_data', async query => {
    try{
        bot.sendMessage(query.chat.id, 'Заявка отправлена, ожидайте принятия в команду')
        const webAppData = JSON.parse(query.web_app_data.data);
        const first = webAppData.country;
        const second = webAppData.street;
        globalUserName = query.chat?.username
        bot.sendMessage(-1002167652118, `Новая заявка от пользователя: @${query.chat?.username}\n\n<blockquote>Откуда узнал о проекте?</blockquote>\n${first}\n\n<blockquote>Есть ли опыт работы в данной тематике?</blockquote>\n${second}\n`,{
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: 'Принять', callback_data: 'submit'},
                        {text: 'Отклонить', callback_data: 'decline'}
                    ]
                ],
            }
        });
    } catch (e) {
        console.log(e)
    }

})

const PORT = 5000

app.listen(PORT, () => console.log(`Listening on ${PORT}`))