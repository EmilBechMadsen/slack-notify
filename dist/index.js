/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 723:
/***/ ((module) => {

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
  
  module.exports.buildSlackAttachments = buildSlackAttachments;
  
  function formatChannelName(channel) {
    return channel.replace(/[#@]/g, '');
  }
  
  module.exports.formatChannelName = formatChannelName;
  

/***/ }),

/***/ 442:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 183:
/***/ ((module) => {

module.exports = eval("require")("@slack/web-api");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(442);
const { WebClient } = __nccwpck_require__(183);
const { SlackAttachments, formatChannelName } = __nccwpck_require__(723);

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

})();

module.exports = __webpack_exports__;
/******/ })()
;