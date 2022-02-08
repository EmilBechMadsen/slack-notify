function getSlackMessage({ message, color, reason, branch, actor }) {
    var messages = message.split('|')
    

    let result = [
            {
                type: "context",
                elements: [
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
        ];
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
    return result;
  }
  
  module.exports.getSlackMessage = getSlackMessage;
  
  function formatChannelName(channel) {
    return channel ? channel.replace(/[#@]/g, '') : '';
  }
  
  module.exports.formatChannelName = formatChannelName;
  