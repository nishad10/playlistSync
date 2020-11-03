const appleMusicUtils = require('./appleMusicUtils')

const sync = async () => {
    console.log('Syncing')
    const playlists = await appleMusicUtils.getPlaylistData()
    const playlistsWithMusic = await appleMusicUtils.addMusicData(playlists)
    console.log(playlistsWithMusic)
}

module.exports = { sync }
