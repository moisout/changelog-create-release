import { setOutput, setFailed } from '@actions/core';
import { context as githubContext } from '@actions/github';

const a: string = 'a';

try {
  console.log(`Hello user!`);
  const time = new Date().toTimeString();
  setOutput('time', time);

  const payload = JSON.stringify(githubContext.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
} catch (error) {
  setFailed(error.message);
}
