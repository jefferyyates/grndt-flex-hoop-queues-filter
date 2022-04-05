const TokenValidator = require('twilio-flex-token-validator').functionValidator;

exports.handler = TokenValidator(function(context, event, callback) {
  // Create a custom Twilio Response
  // Set the CORS headers to allow Flex to make an HTTP request to the Twilio Function
  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Use FileSystem library to read the json.
  const fs = require('fs');
  const file = Runtime.getAssets()['/hoop.json'].path;
  const text = fs.readFileSync(file).toString('utf-8');


  let basicHoops = JSON.parse(text);

  let newData = {
    timezone: basicHoops.timezone,
  };

  // Pull all queues
  const client = context.getTwilioClient();
  client.taskrouter.workspaces(context.WORKSPACE_SID)
    .taskQueues
    .list()
    .then(taskQueues => {
      taskQueues.forEach(t => {
        const daysHours = findFor(t.friendlyName, basicHoops);
        newData[t.friendlyName] = daysHours;
      });
      
      // Update the rest of the response.
      response.appendHeader('Content-Type', 'application/json');
      response.setBody(newData);

      callback(null, response);
    });
});


const findFor = (rawQueueName = String, theHoops = {}) => {
  // Use .toLowerCase() for comparison purposes
  const queueName = rawQueueName.toLowerCase();
  
  for(const [rawKey,value] of Object.entries(theHoops)) {
    let key = rawKey.toLowerCase();

    // Want to match queueName like "baas gbr lost stolen t1 en"
    // to a key like "baas gbr" to get started
    if(queueName.startsWith(key)) {
      for(const[rawSubKey, subValue] of Object.entries(value)) {
        let subKey = rawSubKey.toLowerCase();
        
        // Want to match a subKey like "lost stolen"
        // to anything inside queueName like "baas gbr lost stolen t1 en"
        if(queueName.indexOf(subKey) != -1) {
          return subValue;
        }
      }
    }
  }

  // If we haven't found a set of hours to return yet, check the global category
  for(const[rawKey, value] of Object.entries(theHoops.global)) {
    let key = rawKey.toLowerCase();
    
    // Want to match a key like "lost stolen"
    // to anything inside queueName like "baas gbr lost stolen t1 en"
    if(queueName.indexOf(key) != -1) {
      return value;
    }
  }

  // Have to returrn SOMETHING, so we use the global global values
  return theHoops.global.global;
}
