var mqtt = require('mqtt')

var IotCoreEndPoint = 'wss://********-ats.iot.ap-southeast-1.amazonaws.com/mqtt'
var topicSub = 'example/data-telemetry/#'
var client = null

main(); // run main

async function main () {
  try {
    let canonicalQuerystring = '******************************'; // Put signature V4 here
    await websocketSigV4({ canonicalQuerystring })
  } catch (error) {
    console.log(error)
  }
}

async function websocketSigV4 (params) {
  try {
    let { canonicalQuerystring } = params

    client  = mqtt.connect(`${IotCoreEndPoint}?${canonicalQuerystring}`)

    client.on('connect', function () {
      client.subscribe(topicSub, function (err) {
        if (!err) {
          console.log("connected using sigv4")
          console.log(canonicalQuerystring)
        } else {
          console.log(err)
        }
      })
    })

    // incoming message
    client.on('message', function (topic, message) {
      console.log(message.toString()) // message is Buffer
      // client.end()
    })

    client.on('close', async function (topic, message) {
      console.log('client close')
      client.reconnect()
    })

  } catch (error) {
    throw error
  }
}