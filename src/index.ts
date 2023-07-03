import './polyfills/crypto';
import { setOutput, setFailed } from '@actions/core';
// import { context as githubContext } from '@actions/github';
import fs from 'fs';

try {
  console.log(`Hello user!`);
  const changelog = fs.readFileSync('./CHANGELOG.md', 'utf8');
  console.log('The changelog in question: ', changelog);

  // const payload = JSON.stringify(githubContext.payload, undefined, 2);
  // console.log(`The event payload: ${payload}`);
} catch (error) {
  setFailed(error.message);
}
