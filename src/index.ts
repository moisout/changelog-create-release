import './polyfills/crypto';
import { getInput, setFailed } from '@actions/core';
import { getOctokit, context } from '@actions/github';
import fs from 'fs';
import MarkdownIt from 'markdown-it';
import { parseChangelogAST } from './changelogParser';
import semver from 'semver';
import { ParsedChangelog } from './types/ParsedChangelog';

const getLatestRelease = async () => {
  const token = getInput('github-token');

  const octokit = getOctokit(token);

  const releases = await octokit.rest.repos.listReleases({
    owner: context.repo.owner,
    repo: context.repo.repo,
  });

  const latestRelease = releases.data[0];
  return latestRelease;
};

const createDraftRelease = async (latestVersion: ParsedChangelog) => {
  const token = getInput('github-token');

  const octokit = getOctokit(token);

  await octokit.rest.repos.createRelease({
    owner: context.repo.owner,
    repo: context.repo.repo,
    tag_name: `v${latestVersion.version}`,
    name: `v${latestVersion.version}`,
    body: latestVersion.content,
    draft: true,
  });
};

const updateRelease = async (id: number, latestVersion: ParsedChangelog) => {
  const token = getInput('github-token');

  const octokit = getOctokit(token);

  await octokit.rest.repos.updateRelease({
    owner: context.repo.owner,
    repo: context.repo.repo,
    release_id: id,
    tag_name: `v${latestVersion.version}`,
    name: `v${latestVersion.version}`,
    body: latestVersion.content,
  });
};

const updateOrCreateRelease = async () => {
  const changelog = fs.readFileSync('./CHANGELOG.md', 'utf8');

  const parser = new MarkdownIt();

  const AST = parser.parse(changelog, {});
  const latestVersionFromChangelog = parseChangelogAST(AST);

  const latestRelease = await getLatestRelease();

  if (semver.gt(latestRelease.tag_name, latestVersionFromChangelog.version)) {
    createDraftRelease(latestVersionFromChangelog);
  } else {
    updateRelease(latestRelease.id, latestVersionFromChangelog);
  }

  console.log('latest release');
  console.log(latestRelease);
};

try {
  updateOrCreateRelease();

  // const payload = JSON.stringify(githubContext.payload, undefined, 2);
  // console.log(`The event payload: ${payload}`);
} catch (error) {
  setFailed(error.message);
}
