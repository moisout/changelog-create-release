import './polyfills/crypto';
import { getInput, setFailed } from '@actions/core';
import { getOctokit, context } from '@actions/github';
import fs from 'fs';
import MarkdownIt from 'markdown-it';
import { Changelog } from './types/Changelog';

const parseChangelogAST = (AST: Changelog) => {
  let latestVersion;

  AST.forEach((element, index) => {
    const previousElement = AST[index - 1];
    const nextElement2 = AST[index + 2];

    if (
      previousElement?.type === 'heading_open' &&
      previousElement?.tag === 'h2' &&
      nextElement2
    ) {
      if (element.content !== '[Unreleased]') {
        latestVersion = {
          version: element.children[1].content,
          content: '',
        };
        AST.slice(index + 2, AST.length).forEach((element, index) => {
          if (element.type === 'heading_open' && element.tag === 'h2') {
            return;
          }

          if (element.type === 'heading_close') {
            latestVersion.content += '\n';
            return;
          }

          if (
            !(
              element.type.includes('bullet_list') ||
              element.type.includes('list_item_close')
            )
          ) {
            if (element.type.includes('paragraph_close')) {
              latestVersion.content += '\n';
            } else {
              latestVersion.content += element.markup + element.content;
            }
          }
        });
      }
    }
  });

  console.log('latest version');
  console.log(latestVersion);
};

const getLatestRelease = async () => {
  const token = getInput('github-token');

  const octokit = getOctokit(token);

  const releases = await octokit.rest.repos.listReleases({
    owner: context.repo.owner,
    repo: context.repo.repo,
  });

  console.log(releases);
  const latestRelease = releases.data[0];
  return latestRelease;
};

const updateOrCreateRelease = async () => {
  const changelog = fs.readFileSync('./CHANGELOG.md', 'utf8');

  const parser = new MarkdownIt();

  const AST = parser.parse(changelog, {});
  parseChangelogAST(AST);

  const latestRelease = await getLatestRelease();

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
