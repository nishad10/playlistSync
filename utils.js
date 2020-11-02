const axios = require('axios');

const axiosApple = axios.create({
  baseURL: 'https://amp-api.music.apple.com/v1/me/library/playlist-folders/p.playlistsroot/children',
  timeout: 1000,
   headers: { 
    'media-user-token': process.env.MEDIATOKEN, 
    'Authorization': process.env.AUTHTOKEN, 
    'Content-Type': 'application/json'
  }
});

const getPlaylists = () => {
    console.log('Scraping Started')
    axiosApple.get().then((response)=> {
    console.log(response)
  });

}

module.exports = {getPlaylists}