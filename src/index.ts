import './polyfills/crypto';
import { setFailed } from '@actions/core';
import fs from 'fs';
import MarkdownIt from 'markdown-it';
import { parseChangelogAST } from './changelogParser';
import semver from 'semver';
import { createDraftRelease, getLatestRelease, updateRelease } from './octokit';

const updateOrCreateRelease = async () => {
  const changelog = fs.readFileSync('./CHANGELOG.md', 'utf8');

  const parser = new MarkdownIt();

  const AST = parser.parse(changelog, {});
  const latestVersionFromChangelog = parseChangelogAST(AST);

  const latestRelease = await getLatestRelease();

  if (semver.gt(latestVersionFromChangelog.version, latestRelease.tag_name)) {
    console.log('Creating draft release');
    createDraftRelease(latestVersionFromChangelog);
  } else if (latestRelease.draft) {
    console.log('Latest release is a draft, updating it');
    updateRelease(latestRelease.id, latestVersionFromChangelog);
  } else {
    console.log('Latest release is not a draft, skipping');
  }
};

try {
  updateOrCreateRelease();

  // const payload = JSON.stringify(githubContext.payload, undefined, 2);
  // console.log(`The event payload: ${payload}`);
} catch (error) {
  setFailed(error.message);
}
