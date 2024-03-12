import './polyfills/crypto';
import { setFailed, setOutput } from '@actions/core';
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

  console.log('Latest release', latestRelease.name);
  console.log(
    'Latest version from changelog',
    latestVersionFromChangelog.version
  );

  if (semver.gt(latestVersionFromChangelog.version, latestRelease.tag_name)) {
    createDraftRelease(latestVersionFromChangelog);
    setOutput(
      'release-version',
      `Created draft release for v${latestVersionFromChangelog.version}`
    );
  } else if (latestRelease.draft) {
    updateRelease(latestRelease.id, latestVersionFromChangelog);
    setOutput(
      'release-version',
      `Updated draft release for v${latestVersionFromChangelog.version}`
    );
  } else {
    setOutput(
      'release-version',
      `Skipped updating an already published release for v${latestVersionFromChangelog.version}`
    );
  }
};

try {
  updateOrCreateRelease();
} catch (error) {
  setFailed(error.message);
}
