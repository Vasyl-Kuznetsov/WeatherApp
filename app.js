const express = require('express');
const hbs = require("hbs");
const fs = require('fs');
const axios = require('axios');

const app = express();
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials');

const cities = JSON.parse(fs.readFileSync('cities.json', 'utf-8'));
const API_KEY = 'Removed'; //<- Insert your key here

app.use(express.json());

app.get('/', (req, res) => {
    res.render('home.hbs', { cities });
});

app.get('/weather/:city', async (req, res) => {
    const city = req.params.city;
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );
        const weatherData = {
            city: city,
            temperature: response.data.main.temp,
            humidity: response.data.main.humidity,
            pressure: response.data.main.pressure,
            description: response.data.weather[0].description,
            icon: response.data.weather[0].icon
        };
        res.render('weather.hbs', { weatherData, cities });
    } catch (error) {
        res.status(404).send('City not found or API error: ' + error.response.data.message);
    }
});

app.get('/weather', async (req, res) => {
    const city = cities[0].name;
    res.redirect(`/weather/${city}`);
});

app.listen(3000, () => {
    console.log("Example App Listening on port 3000");
});
