const core = require('@actions/core');
const { WebClient } = require('@slack/web-api');
const { getSlackMessage, formatChannelName } = require('./src/slack');

(async () => {
  try {
    const channel = core.getInput('channel') || process.env.channel;
    const status = core.getInput('message') || process.env.message;
    const color = core.getInput('color') || process.env.repoUrl;
    const messageId = core.getInput('message_id')  || process.env.message_id;
    const reason = core.getInput('reason')  || process.env.reason;
    const projectName = core.getInput('project_name')  || process.env.project_name;
    const actor = core.getInput('actor')  || process.env.actor;
    const repoUrl = core.getInput('repo_url') || process.env.repo_url;
    const token = process.env.SLACK_BOT_TOKEN;
    const slack = new WebClient(token);
    const channel_id = core.getInput('channel_id') || process.env.channel_id;
    
    if (!channel && !channel_id) {
      core.setFailed(`You must provider either a 'channel' or a 'channel_id'.`);
      return;
    }

    const attachments = getSlackMessage({ status, color, reason, projectName, actor, repoUrl });
    const channelId = core.getInput('channel_id') || (await lookUpChannelId({ slack, channel }));

    if (!channelId) {
      core.setFailed(`Slack channel ${channel} could not be found.`);
      return;
    }

    const apiMethod = Boolean(messageId) ? 'update' : 'postMessage';

    const args = {
      channel: channelId,
      attachments,
    };

    if (messageId) {
      args.ts = messageId;
    }

    const response = await slack.chat[apiMethod](args);

    core.setOutput('message_id', response.ts);
  } catch (error) {
    core.setFailed(error);
  }
})();

async function lookUpChannelId({ slack, channel }) {
  let result;
  const formattedChannel = formatChannelName(channel);

  // Async iteration is similar to a simple for loop.
  // Use only the first two parameters to get an async iterator.
  for await (const page of slack.paginate('conversations.list', { types: 'public_channel, private_channel' })) {
    // You can inspect each page, find your result, and stop the loop with a `break` statement
    const match = page.channels.find(c => c.name === formattedChannel);
    if (match) {
      result = match.id;
      break;
    }
  }

  return result;
}
