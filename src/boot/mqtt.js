import VueMqtt from 'vue-mqtt'
import { mqttUrl } from '../../public/config/config'
// import fs from 'fs' //not working

export default ({ Vue }) => {
  console.log('boot',mqttUrl);
  // Vue.use(VueMqtt, 'ws://mqtt.frrut.net:9000/mqtt', 
  Vue.use(VueMqtt, mqttUrl,
  { clientId: ('WebClient-' + parseInt(Math.random() * 100000)) })
  // const fs = require('fs'); //not working

  // var options = {
  //   clientId: ('WebClient-' + parseInt(Math.random() * 100000)),
  //   // key: fs.readFileSync('../../client/client.key'),
  //   // cert: fs.readFileSync('../../client/client.pem'),

  //   // // Necessary only if the server uses a self-signed certificate.
  //   // ca: [ fs.readFileSync('../../ca.pem') ],
  // }
  // Vue.use(VueMqtt, 'wss://m2.frrut.net:9000/mqtt', { clientId: ('WebClient-' + parseInt(Math.random() * 100000)) } )

}
