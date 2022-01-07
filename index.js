'use strict';

import fetch from "node-fetch";
import express from 'express'
import {TOKEN} from  './config.js'
import {Telegraf} from 'telegraf'
const apikey = '4c62d4734ce269a5daa0ab6aa0dd4a82';
let url = (city) =>
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;

const app = express()
const bot = new Telegraf(TOKEN)

bot.start(ctx => {
    ctx.reply('Доброго времени суток!')
})

bot.on('voice', ctx => {
    ctx.reply('Я не знаю что на это ответить...')
})

bot.on('sticker', ctx => {
    ctx.reply('Хороший стикер, жаль я его не вижу')
})

bot.on('edited_message', ctx => {
    ctx.reply('Зачем вы изменили сообщение?')
})

bot.hears('/help',ctx => {
    ctx.reply('Больше информации будет позже')
})

bot.launch()
app.listen(() => console.log(`My Bot started`))

bot.on('text', async (ctx) => {

    const ToCeliac = (degree) => (degree - 273).toFixed(2);

    const showWeather = (weather) => {
        const temp = ToCeliac(weather.main.temp);
        const formatData = `
           Город🏘: ${city},
           Температура🌡: ${temp},
           Скорость ветра🌬: ${weather.wind.speed},
           Влажность💦: ${weather.main.humidity}%`
        ctx.reply(formatData)
    };

    const weatherBallon = async ( city)=> {
        try {
            await fetch(url(city), {origin: 'cors'})
                .then(function (resp) {
                    return resp.json()
                }) // превращает данные в json
                .then(function (data) {
                    showWeather(data);
                    console.log(data)
                })
        }
        catch(e){
                ctx.reply('Такого города не существует, повторите пожалуйста запрос')
            }
    }
    const city = ctx.message.text
    weatherBallon( city )
})
