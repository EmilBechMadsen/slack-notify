const core = require('@actions/core');
const { WebClient } = require('@slack/web-api');
const { getSlackMessage, formatChannelName } = require('./src/slack');

(async () => {
  try {
    const channel = core.getInput('channel') || process.env.SLACK_CHANNEL;
    const message = core.getInput('message') || process.env.SLACK_MESSAGE;
    const color = core.getInput('color') || process.env.SLACK_COLOR;
    const messageId = core.getInput('message_id')  || process.env.SLACK_MESSAGE_ID;
    const reason = core.getInput('reason')  || process.env.SLACK_REASON;
    const branch = core.getInput('branch')  || process.env.SLACK_BRANCH;
    const actor = core.getInput('actor')  || process.env.SLACK_ACTOR;
    const token = process.env.SLACK_BOT_TOKEN;
    const slack = new WebClient(token);
    const channel_id = core.getInput('channel_id') || process.env.SLACK_CHANNEL_ID;
    
    if (!channel && !channel_id) {
      core.setFailed(`You must provider either a 'channel' or a 'channel_id'.`);
      return;
    }

    const attachments = getSlackMessage({ message, color, reason, branch, actor });
    const channelId = channel_id || (await lookUpChannelId({ slack, channel }));

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
