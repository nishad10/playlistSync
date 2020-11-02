require('dotenv').config()
const {scrape} = require('./utils')
const cron = require('node-cron');

cron.schedule('* * * * *', () => {
    console.log('running a task every minute');
    scrape()
});