function getSlackMessage({ message, color, reason, branch, actor }) {
    var messages = message.split('|').join('\n');
  
    return [
      {
        color,
        fields: [
          {
            title: 'Reason',
            value: `${reason}`
          },
          {
            title: 'Branch',
            value: `${branch}`,
            short: true,
          },
          {
            title: 'User',
            value: actor,
            short: true,
          },
          {
            title: 'Status',
            value: `${messages}`,
            short: true,
          },
        ],
        ts: Math.floor(Date.now() / 1000),
      },
    ];
  }
  
  module.exports.getSlackMessage = getSlackMessage;
  
  function formatChannelName(channel) {
    return channel.replace(/[#@]/g, '');
  }
  
  module.exports.formatChannelName = formatChannelName;
  