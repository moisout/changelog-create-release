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

  console.log(latestVersionFromChangelog);

  const latestRelease = await getLatestRelease();

  console.log('latest release', semver.parse(latestRelease.tag_name));
  console.log(
    'latest version from changelog',
    semver.parse(latestVersionFromChangelog.version)
  );

  if (semver.gt(latestRelease.tag_name, latestVersionFromChangelog.version)) {
    console.log('Creating draft release');
    createDraftRelease(latestVersionFromChangelog);
  } else {
    console.log('Updating release');
    updateRelease(latestRelease.id, latestVersionFromChangelog);
  }
};

try {
  updateOrCreateRelease();

  // const payload = JSON.stringify(githubContext.payload, undefined, 2);
  // console.log(`The event payload: ${payload}`);
} catch (error) {
  setFailed(error.message);
}
