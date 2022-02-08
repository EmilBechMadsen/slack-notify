function getSlackMessage({ status, color, reason, projectName, actor, repoUrl }) {
    var statuses = status.split('|').join('\n');
  
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
            value: `<${repoUrl} | ${projectName || repo}>`,
            short: true,
          },
          {
            title: 'User',
            value: actor || context.actor,
            short: true,
          },
          {
            title: 'Status',
            value: `${statuses}`,
            short: true,
          },
        ],
        footer_icon: 'https://github.githubassets.com/favicon.ico',
        footer: `<https://github.com/${owner}/${repo} | ${owner}/${repo}>`,
        ts: Math.floor(Date.now() / 1000),
      },
    ];
  }
  
  module.exports.getSlackMessage = getSlackMessage;
  
  function formatChannelName(channel) {
    return channel.replace(/[#@]/g, '');
  }
  
  module.exports.formatChannelName = formatChannelName;
  