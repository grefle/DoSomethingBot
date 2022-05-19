"use strict";

import fetch from "node-fetch";
import {TOKEN, apikey, clothes} from  "./config.js"
import {Telegraf} from "telegraf"

const url = (city) =>
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;

const bot = new Telegraf(TOKEN)

bot.launch()
console.log("Бот працює! Нік в телеграмі: @SomethingForBot")

//Старт бота
bot.start(ctx => {
    ctx.reply("Слава Україні!")
})

//Повідомлення під час введення голосових
bot.on("voice", ctx => {
    ctx.reply("Вибачте, я не вмію розмовляти..")
})

//Повідомлення при надсиланні стікерів
bot.on("sticker", ctx => {
    ctx.reply("Гарний стікер!")
})

//Повідомлення при зміні повідомлення
bot.on("edited_message", ctx => {
    ctx.reply("Навіщо ви змінили повідомлення?")
})

//Повідомлення під час введення допомоги
bot.hears("/help",ctx => {
    ctx.reply("/start - Запустити бота\n" +
        "/help - Допомога з ботом\n" +
        "/catfact - Випадковий факт про котів\n" +
        "/weather (Ваше місто) - Дізнатися погоду в місті")
})

//Повідомлення при команді для видачі фактів про котиків
bot.hears("/catfact",async ctx => {
        const CatFact = async ( )=> {
            try {
                await fetch("https://catfact.ninja/fact")   // змушує чекати на виконання запиту серверу
                    .then(function (resp) {
                        return resp.json()
                    })                               // перетворює дані на json
                    .then(function (data) {
                        ctx.reply(data.fact);
                        // по ланцюжку then-ів відповідає користувачеві
                    })
            }
            catch(e){
                ctx.reply("Вибачте, я зламався, мій творець не дуже тямущий")
            }
        }
    ctx.reply("Сподіваюся ці факти покращить ваш настрій, незважаючи на погоду🐱");
    await CatFact ( )
    console.log("Хтось запустив бота")
    })

//Повідомлення при введенні команди та міста
bot.on("text", async (ctx) => {
    const userMessage=ctx.message.text
    const city = userMessage.substr(9, userMessage.length)
    const ToCeliac = (degree) => (degree - 273).toFixed(2);

    const showWeather = async (data) => {
        try{
            const temp = ToCeliac(data.main.temp);
            const formatData = `
                Місто🏘: ${city}
                \nЗагальна погода🧾: ${data.weather[0].main}
                \nДетальніше про погоду🖊: ${data.weather[0].description}
                \nТемпература🌡: ${temp}
                \nШвидкість вітру🌬: ${data.wind.speed}
                \nВологість💦: ${data.main.humidity}%`
                await ctx.replyWithPhoto({source: "./images/"+data.weather[0].main+".jpg"},{caption: formatData})
                for (let key in clothes) {
                    if (key==data.weather[0].main){
                        ctx.reply(clothes[key])
                    }
                }

        } catch (e){
            ctx.reply("Такого міста не існує або дані про погоду пошкоджені, повторіть, будь ласка, запит")
        }
    };

    const FindDataForWeather = async (city) => {
        try {
            await fetch(url(city))
                .then(function (resp) {
                    return resp.json()
                })
                .then(function (data) {
                    showWeather(data);
                })
        } catch (e) {
            ctx.reply("Такого міста не існує, повторіть будь-ласка запит")
        }
    }
    if (userMessage.includes("/weather")) {
        await FindDataForWeather(city)
    } else {
        ctx.reply("Такої команди не знайдено, скористайтеся командою /help")
    }
    console.log("Хтось запустив бота")
})
