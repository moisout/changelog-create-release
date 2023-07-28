import { getOctokit, context } from '@actions/github';
import { getInput } from '@actions/core';
import { ParsedChangelog } from './types/ParsedChangelog';
import semver from 'semver';

export const getLatestRelease = async () => {
  const token = getInput('github-token');

  const octokit = getOctokit(token);

  const releases = await octokit.rest.repos.listReleases({
    owner: context.repo.owner,
    repo: context.repo.repo,
  });

  const latestRelease = releases.data.sort((a, b) => {
    const releaseA = a.name.split('-')[0];
    const releaseB = a.name.split('-')[0];
    return semver.compare(releaseA, releaseB);
  })[0];

  return latestRelease;
};

export const createDraftRelease = async (latestVersion: ParsedChangelog) => {
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

export const updateRelease = async (
  id: number,
  latestVersion: ParsedChangelog
) => {
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
