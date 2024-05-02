// Discord ChatBot

require('dotenv').config();
const { getWeather } = require('./weather');
const axios = require('axios');
const { createApi } = require('unsplash-js');
const { getRandomMemeFromReddit } = require('./redditMeme');

// Connect to Discord API
const { Client,GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Unsplash API
const unsplash = createApi({
  accessKey: 'dXJdImy2mwKerTDssln8eofSuY3eOgy4XTCKtbz4wS8',
});

// Pre-defined Questions and Answers
const questions = [
  {
    question: 'hello', 
    answer: 'Hi there! How can I help you today?',
  },
  {
    question: 'name',
    answer: 'My name is IntelliBot. What should I call you?',
  },
  {
    question: 'meghna',
    answer: 'Hi Meghna! How can I help you today?',
  },
  {
    question: 'krish',
    answer: 'Hi Krish! How can I help you today?',
  },
  {
    question: 'help',
    answer: 'I can answer some basic questions or entertain you with a joke. What would you like me to do?',
  },
  {
    question: 'joke',
    answer: 'Why did the scarecrow win an award? Because he was outstanding in his field!',
  },
  {
    question: 'age',
    answer: 'I am Three months old!',
  },
  {
    question: 'bye',
    answer: 'Goodbye! Have a great day!',
  },
  {
    question: 'fun fact',
    answer: 'Did you know the population of the earth is estimated to be over 8 billion people?! That\'s a lot of people to say hello to!',
  },
  {
    question: 'what can you do',
    answer: 'I\'m still under development, but I can answer basic questions, tell jokes, and even share some fun facts! What would you like me to try?',
  },
  {
    question: 'do you have a favourite colour',
    answer: 'As a large language model, I don\'t have personal preferences among colours. However, I can tell you that blue is a very popular color that often symbolizes trust, peace, and tranquility.',
  },
  {
    question: 'what are you passionate about',
    answer: 'I\'m passionate about learning and helping people! I enjoy using my knowledge to answer their questions and complete tasks in a helpful and informative way.',
  },
  {
    question: 'weather',
    answer: 'I can\'t directly access weather information yet, but I can help you search the web for the current forecast. Would you like me to do that?',
  },
];

client.on('messageCreate',async function(message) {
  try 
  {
    // Checks if the Message Author is a Bot
    if (message.author.bot) return;

    console.log(`Message (${message.channel.name}): ${message.content}`);

    // Meme
    if (message.content.toLowerCase() === '!meme') {
      try {
        const memeUrl = await getRandomMemeFromReddit('memes');
        message.reply({ content: 'Here is a random meme for you:', embeds: [{ image: { url: memeUrl } }] });
        return;
      } catch (error) {
        console.error('Error:', error.message);
        message.reply('Oops! Something went wrong while fetching the meme.');
        return;
      }
    }

    // Generates Random Image based on Command
    if (message.content.toLowerCase().startsWith('!image')) {
      const query = message.content.slice('!image'.length).trim();
      try {
        const response = await unsplash.photos.getRandom({ query, orientation: 'landscape' });
        const imageUrl = response.response.urls.regular;

        message.reply({ content: `Here is a random image related to ${query}:`, embeds: [{ image: { url: imageUrl } }] });
        return; 
      } catch (error) {
        console.error('Error fetching image:', error);
        message.reply(`Oops! Something went wrong while fetching the PNG image for ${query}.`);
        return; 
      }
    }

    // Reminder and Scheduling Functionality    
    if (message.content.toLowerCase().startsWith('!reminder')) 
    {
      const args = message.content.slice('!reminder'.length).trim().split(/ +/);
      const time = parseInt(args.shift());
      const unit = args.shift();
      const reminder = args.join(' ');

      if (isNaN(time) || !unit || !reminder) 
      {
        return message.reply('Invalid reminder format! Please use: !reminder <time> <unit> <reminder>');
      }

      let timeInMs;
      switch (unit) 
      {
        case 'seconds':
          timeInMs = time * 1000;
          break;
        case 'minutes':
          timeInMs = time * 1000 * 60;
          break;
        case 'hours':
          timeInMs = time * 1000 * 60 * 60;
          break;
        case 'days':
          timeInMs = time * 1000 * 60 * 60 * 24;
          break;
        default:
          return message.reply('Invalid time unit! Please use: seconds, minutes, hours, or days.');
      }

      setTimeout(() => {
        message.reply('Reminder: ' + reminder);
      },timeInMs);
      return message.reply(`Reminder set for ${time} ${unit}: ${reminder}`);
    }

    console.log(`Message (${message.channel.name}): ${message.content}`);

    // The Calculator 
      if (message.content.toLowerCase().startsWith('!calc')) {
        const expression = message.content.slice('!calc'.length).trim();
        
        try {
            const result = eval(expression);
            message.reply(`Result: ${result}`);
            return;
        } catch (error) {
            console.error('Error evaluating expression:', error);
            message.reply('Oops! Something went wrong while calculating.');
            return;
        }

      }

    // Handle weather command
    if (message.content.toLowerCase().startsWith('!weather')) {
      const cityName = message.content.slice('!weather'.length).trim();
      const apiKey = process.env.OPENWEATHERMAP_API_KEY; 
      const weatherInfo = await getWeather(cityName, apiKey);
      message.reply(weatherInfo);
      return;
  }

    // Matching the Predefined Question
    const matchingQuestion = questions.find((q) => message.content.toLowerCase().includes(q.question));

    if (matchingQuestion) 
    {
      // Reply 
      message.reply(matchingQuestion.answer);
    } 
    else 
    {
      // Handle unmatched messages
      const randomReplies = [
        "Hmm, that's an interesting question. Let me see if I can find some information...",
        "Feel free to ask anything else you have in mind!",
      ];
      const randomReply = randomReplies[Math.floor(Math.random() * randomReplies.length)];
      message.reply(randomReply);
    }
  }

  catch (err) 
  {
    console.error('Error processing message:',err);

    // Error Handling
    message.reply('Oops, something went wrong. I\'m still under development, but I\'ll try my best next time!');
  }
});

// Log the Bot into Discord
client.login(process.env.DISCORD_TOKEN);
console.log('IntelliBot is Online on Discord');