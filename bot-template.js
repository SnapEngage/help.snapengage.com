/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.processJSON = (req, res) => {
  // Check for header authorization token
  if (req.header('authorization') !== '12345678') {
    respondToSnapEngage(req, res, 'You are not authorized to chat with me, goodbye!', 'BYE', '');
    return;
  }

  var message = req.body.text;
  if (!message) {
    message = req.body.description;
  }
  
  // temporary code to ignore the system messages
  // once the API backend no longer sends the system message, this can be removed
  if (message && message.indexOf('[Contact Details') !== -1) {
    message = '';
  }
  // end of temporary code

  // temporary logging
  console.log('message=' + message);
  
  if (message) {
    message = message.toLowerCase();

    if (message.indexOf('summer') !== -1
        || message.indexOf('holiday') !== -1
        || message.indexOf('villa') !== -1
        || message.indexOf('appartment') !== -1
        || message.indexOf('vacation') !== -1) {
      respondToSnapEngage(req, res, 'We can help with your holiday accommodation, let me put you in touch with my colleague, please hold.', 'HUMAN_TRANSFER');
    } else if (message.indexOf('conference') !== -1
               || message.indexOf('event') !== -1
               || message.indexOf('fair') !== -1
               || message.indexOf('work trip') !== -1
               || message.indexOf('retreat') !== -1) {
      respondToSnapEngage(req, res, 'Unfortunately we do not organise work events, or conferences, and we are not able to assist.', 'BYE');
    } else if (message.indexOf('spain') !== -1) {
      respondToSnapEngage(req, res, 'We can help with your holiday in Spain, which specific area were you thinking of?', '', '', [{
        "text": "Costa del sol"
      }, {
        "text": "Balearic Islands"
      }, {
        "text": "Basque Country"
      }, {
        "text": "Galicia"
      }]);
    } else if (message.indexOf('costa') !== -1
               || message.indexOf('balearic') !== -1 
               || message.indexOf('basque') !== -1) {
      respondToSnapEngage(req, res, 'We can help with that, let me transfer you to a specialist!', 'HUMAN_TRANSFER');
    } else if (message.indexOf('galicia') !== -1) {
      respondToSnapEngage(req, res, 'Unfortunately, we do not have any holiday homes in Galicia, and we cannot assist.', 'BYE', '');
    } else {
      // temporary logging
      console.log('We are in the else -- no keyword matched');
      
      // Anything else goes to a human transfer
      respondToSnapEngage(req, res, 'Let me transfer you to a human colleague', 'HUMAN_TRANSFER');
    }
  } else {
    // temporary logging
    console.log('We are in the handler for the empty/undefined message. Object: ' + JSON.stringify(req.body));
    
    // SnapEngage sent an empty message
    respondToSnapEngage(req, res);
  }
};

/*
* respondToSnapEngage: send a JSON response to the webhook
*
* @param req HTTP request context.
* @param res HTTP response context.
* @param text text to send back to the visitor
* @param command (optional) command to send back to SnapEngage
* @param commandParams (optional) command parameters when applicable (i.e. widget ID to
transfer to, URL for the GOTO command)
* @param buttons (option) array of buttons, i.e. [{"text": "Yes"}, {"text": "No"}]
*/
function respondToSnapEngage(req, res, text, command, commandParams, buttons) {
  var request = req.body;
  var response = {};
  response.widget_id = request.widget_id;
  response.case_id = request.case_id;
  var content = [];

  if (buttons) {
    content.push({
      "type": "message",
      "text": text,
      "display_responses": buttons
    });
  } else {
    content.push({
      "type": "message",
      "text": text
    });
  }
  if (command) {
    content.push({
      "type": "command",
      "operation": command,
      "parameters": commandParams
    });
  }
  response.content = content;

  console.log(response);

  res.status(200).send(JSON.stringify(response));
}

/*
* respondToSnapEngage: send a JSON response to the webhook
*
* @param req HTTP request context.
* @param res HTTP response context.
* @param text text to send back to the visitor
* @param command (optional) command to send back to SnapEngage
* @param commandParams (optional) command parameters when applicable (i.e. widget ID to
transfer to, URL for the GOTO command)
* @param buttons (option) array of buttons, i.e. [{"text": "Yes"}, {"text": "No"}]
*/
function respondToSnapEngage(req, res, text, command, commandParams, buttons) {
  var request = req.body;
  var response = {};
  response.widget_id = request.widget_id;
  response.case_id = request.case_id;
  var content = [];

  if (buttons) {
    content.push({
      "type": "message",
      "text": text,
      "display_responses": buttons
    });
  } else {
    content.push({
      "type": "message",
      "text": text
    });
  }
  if (command) {
    content.push({
      "type": "command",
      "operation": command,
      "parameters": commandParams
    });
  }
  response.content = content;

  console.log(response);

  res.status(200).send(JSON.stringify(response));
}
