"use strict";

import fetch from "node-fetch";
import {TOKEN, apikey} from  "./config.js"
import {Telegraf} from "telegraf"

const url = (city) =>
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;

const bot = new Telegraf(TOKEN)

//Старт бота
bot.start(ctx => {
    ctx.reply("Доброго времени суток!")
})

//Сообщение при вводе голосовых
bot.on("voice", ctx => {
    ctx.reply("Я не знаю что на это ответить...")
})

//Сообщение при отправлении стикеров
bot.on("sticker", ctx => {
    ctx.reply("Хороший стикер, жаль я его не вижу")
})

//сообщение при изменении сообщения
bot.on("edited_message", ctx => {
    ctx.reply("Зачем вы изменили сообщение?")
})

//Сообщение при ввода помощи
bot.hears("/help",ctx => {
    ctx.reply("/start - Запустить бота\n" +
        "/help - Помощь с ботом\n" +
        "/catfact - Случайный факт про котов\n" +
        "/weather (Ваш город) - Узнать погоду в городе")
})

//Сообщение при команде для выдачи фактов про котиков
bot.hears("/catfact",async ctx => {
        const CatFact = async ( )=> {
            ctx.reply("Простите, факты только на английском языке🐱");
            try {
                await fetch("https://catfact.ninja/fact")
                    .then(function (resp) {
                        return resp.json()
                    })
                    .then(function (data) {
                        ctx.reply(data.fact);
                    })
            }
            catch(e){
                ctx.reply("Простите, я сломался, мой создатель не очень смышленый")
            }
        }
    await CatFact ( )
    })

bot.launch()
console.log("My Bot started")

//Сообщение при вводе команды и города
bot.on("text", async (ctx) => {
    if (ctx.message.text.includes("/weather")) {
        const userMessage=ctx.message.text
        const city = userMessage.substr(9, userMessage.length)

        const ToCeliac = (degree) => (degree - 273).toFixed(2);

        const showWeather = (data) => {
            const temp = ToCeliac(data.main.temp);
            const formatData = `
           Город🏘: ${city}
           \nОбщая погода🧾: ${data.weather[0].main}
           \nТемпература🌡: ${temp}
           \nСкорость ветра🌬: ${data.wind.speed}
           \nВлажность💦: ${data.main.humidity}%`
            switch (data.weather[0].main) {
                case "Clear":
                    ctx.replyWithPhoto({ source: "./images/Clear.jpg" }, { caption: formatData })
                    break;
                case "Clouds":
                    ctx.replyWithPhoto({source:"./images/Clouds.jpg"}, { caption: formatData })
                    break;
                case "Rain":
                    ctx.replyWithPhoto({source:"./images/Rain.jpg"}, { caption: formatData })
                    break;
                case "Snow":
                    ctx.replyWithPhoto({source:"./images/Snow.jpg"}, { caption: formatData })
                    break;
            }
        };

        const FindDataForWeather = async (city) => {
            try {
                await fetch(url(city))
                    .then(function (resp) {
                        return resp.json()
                    }) // превращает данные в json
                    .then(function (data) {
                        showWeather(data);
                    })
            } catch (e) {
                ctx.reply("Такого города не существует, повторите пожалуйста запрос")
            }
        }

        await FindDataForWeather(city)

    } else {
        ctx.reply("Такая команда не найдена, воспользуйтесь командой /help")
    }
})
