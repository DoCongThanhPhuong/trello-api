/* eslint-disable no-console */
import { CronJob } from 'cron'
import https from 'https'

const URL = 'https://trello-api-fiiz.onrender.com/v1/status'

const job = new CronJob('*/14 * * * *', function () {
  https
    .get(URL, (res) => {
      if (res.statusCode === 200) {
        console.log('APIs v1 are ready to use')
      } else {
        console.log('GET request failed', res.statusCode)
      }
    })
    .on('error', (e) => {
      console.error('Error while sending request', e)
    })
})

export default job
