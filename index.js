'use strict';

var core = require('@actions/core');
var github = require('@actions/github');

try {
  console.log(`Hello user!`);
  const time = (/* @__PURE__ */ new Date()).toTimeString();
  core.setOutput("time", time);
  const payload = JSON.stringify(github.context.payload, void 0, 2);
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
