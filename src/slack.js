function getSlackMessage({ message, reason, branch, actor, slot }) {
    

    let result = []
    if (reason || branch || actor !== "Unknown" || slot)
    {
        result.push(
            {
                type: "header",
                text: {
                    type: "plain_text",
                    text: "Deployment started!"
			    }
		});

        result.push(
            {
                type: "context",
                elements: [
                    {
                        type: "mrkdwn",
                        text: `Slot: *${slot}*`
                    },
                    {
                        type: "mrkdwn",
                        text: `User: *${actor}*`
                    },
                    {
                        type: "mrkdwn",
                        text: `Branch: *${branch}*`
                    },
                    {
                        type: "mrkdwn",
                        text: `Reason: *${reason}*`
                    }
                ]
            },
            {
                type: "divider"
            },
        )
    } else if (message) {
        var messages = message.split('|')
    
        for (let message of messages)
        {
            
            result.push(
                {
                    type: "context",
                    elements: [
                        {
                            type: "mrkdwn",
                            text: message
                        }
                    ]
                }
            );
        }
    }
    return result;
  }
  
  module.exports.getSlackMessage = getSlackMessage;
  
  function formatChannelName(channel) {
    return channel ? channel.replace(/[#@]/g, '') : '';
  }
  
  module.exports.formatChannelName = formatChannelName;
  