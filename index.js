require('dotenv').config()
const { sync } = require('./services')

const cron = require('node-cron');
sync()
cron.schedule('* * * * *', () => {
    console.log('running a task every minute');
    //scrape()
});