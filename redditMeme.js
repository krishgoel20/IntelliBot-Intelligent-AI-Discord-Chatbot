const axios = require('axios');

// Function to fetch a random meme from Reddit
async function getRandomMemeFromReddit(subreddit) {
  try {
    const response = await axios.get(`https://reddit.com/r/${subreddit}/random.json`);
    const memeUrl = response.data[0].data.children[0].data.url;
    return memeUrl;
  } catch (error) {
    console.error('Error fetching meme:', error);
    throw new Error('Failed to fetch meme.');
  }
}

module.exports = { getRandomMemeFromReddit };
