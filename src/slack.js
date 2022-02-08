function getSlackMessage({ message, color, reason, branch, actor }) {
    var messages = message.split('|').join('\n');
    

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
    return result;
  }
  
  module.exports.getSlackMessage = getSlackMessage;
  
  function formatChannelName(channel) {
    return channel ? channel.replace(/[#@]/g, '') : '';
  }
  
  module.exports.formatChannelName = formatChannelName;
  