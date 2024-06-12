const TelegramApi = require('node-telegram-bot-api')
const express = require('express')
const cors = require('cors')


require('dotenv').config()

const token = '7312606330:AAEQ41llrvFafwYabhdupKXkbg3j3-BJ2iM';
const WebAppUrl = 'https://glittering-tulumba-d1e9aa.netlify.app';
const bot = new TelegramApi(token, {polling: {interval: 3000}});
const app = express();
app.use(cors());
app.use(express.json());

bot.on('message',async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if(text === '/start') {
        await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму', {
            reply_markup: {
                keyboard: [
                    [{text: 'Заполнить форму', web_app: {url: WebAppUrl + '/form'}}]
                ]
            }
        })

        await bot.sendMessage(chatId, 'Заходи в наш интернет магазин по кнопке ниже', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Сделать заказ', web_app: {url: WebAppUrl}}]
                ]
            }
        })
    }

    if (msg?.web_app_data?.data){
        try{
            const data = JSON.parse(msg?.web_app_data?.data)

           await bot.sendMessage(chatId, 'Спасибо за обратную связь!')
            await bot.sendMessage(chatId, 'Ваша страна ' + data.country)
            await bot.sendMessage(chatId, 'Ваша улица ' + data.street)
            await bot.sendMessage(chatId, 'Вы блять... ' + data.subject)
        }catch(err){

        }
    }
});

app.post('/web-data', async (req, res) => {
    const {queryId, products, totalPrice, } = res.body;
    try{
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: {
                message_text : `Поздравляю вы приобрели товары на сумму ${totalPrice}`
            }
        })

        return res.status(200).json({});
    }catch(err){
        console.log(err)
        return res.status(500).json({});
    }

})

const PORT = 8080;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));