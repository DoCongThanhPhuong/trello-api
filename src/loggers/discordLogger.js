/* eslint-disable no-console */
'use strict'

import { Client, GatewayIntentBits } from 'discord.js'
import { env } from '~/config/environment'

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.login(env.DISCORD_TOKEN)

const sendFormatCode = (logData) => {
  const {
    code,
    message = 'This is some additional information about the code.',
    title = 'Code example',
    error
  } = logData

  const codeMessage = {
    content: message,
    embeds: [
      {
        color: parseInt('ff0000', 16),
        title,
        description:
          '```json\n' +
          JSON.stringify(code, null, 2) +
          '\n```' +
          ('\n**Error Message:**\n```' + error + '```')
      }
    ]
  }

  sendMessage(codeMessage)
}

const sendMessage = (message = 'message') => {
  const channel = client.channels.cache.get(env.DISCORD_CHANNEL_ID)
  if (!channel) {
    console.error('Could not find the channel', env.DISCORD_CHANNEL_ID)
    return
  }
  channel.send(message).catch((e) => console.error(e))
}

export const discordLogger = { sendFormatCode, sendMessage }
