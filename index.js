require('dotenv').config()
const {getPlaylists} = require('./utils')
const cron = require('node-cron');

getPlaylists()

cron.schedule('* * * * *', () => {
    console.log('running a task every minute');
    //scrape()
});