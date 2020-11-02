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

const getPlaylistData = () => {
    return axiosApple.get().then((response)=> {
        data = response.data.data
        const playlistFinal = data.map(playlist => {
            return ({
                'id': playlist.id,
                'url': playlist.href,
                'name': playlist.attributes.name,
            })
        })
        return playlistFinal
    }).catch((error) => {
      console.log(error)
  });
}

module.exports = {getPlaylistData}