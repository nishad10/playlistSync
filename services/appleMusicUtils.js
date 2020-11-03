const axios = require('axios');

const axiosApple = axios.create({
  baseURL: 'https://amp-api.music.apple.com',
  timeout: 1000,
   headers: { 
    'media-user-token': process.env.MEDIATOKEN, 
    'Authorization': process.env.AUTHTOKEN, 
    'Content-Type': 'application/json'
  }
});

const getPlaylistData = async () => {
    return await axiosApple.get('/v1/me/library/playlist-folders/p.playlistsroot/children').then((response)=> {
        data = response.data.data
        const playlistFinal = data.map(playlist => {
            return ([playlist.id,{
                'id': playlist.id,
                'url': playlist.href,
                'name': playlist.attributes.name,
            }])
        })
        const playlistData = Object.fromEntries(playlistFinal)
        return playlistData
    }).catch((error) => {
      console.log(error)
  });
}

const addMusicData = async (playlists) => {
  const requests = []
      for (const [pid, playlist] of Object.entries(playlists)) {
      requests.push(axiosApple.get(playlist.url+'?include=tracks&include%5Blibrary-playlists%5D=catalog%2Ctracks'))
    }
    const responses = await Promise.all(requests)
    responses.forEach(response => {
        const musicAttributes = response.data.data[0].relationships.tracks.data
      playlists['songData'] = musicAttributes.map(songAttribute => {
        songAttribute = songAttribute['attributes']
        return { 'artistName': songAttribute['artistName'], 'songName': songAttribute['name'], 'albumName': songAttribute['albumName'] }
      })
    })
    return playlists
}

module.exports = {getPlaylistData, addMusicData}