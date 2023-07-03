import './polyfills/crypto';
import { getInput, setFailed } from '@actions/core';
import { getOctokit, context } from '@actions/github';
import fs from 'fs';
import MarkdownIt from 'markdown-it';
import { Changelog } from './types/Changelog';

const parseChangelogAST = (AST: Changelog) => {
  let latestVersion = {};

  const potentialReleases = AST.filter((element, index) => {
    const previousElement = AST[index - 1];
    if (
      previousElement?.type === 'heading_open' &&
      previousElement?.tag === 'h2'
    ) {
      return true;
    }
  }).filter((element) => {
    return element.content !== '[Unreleased]';
  });

  console.log(potentialReleases);
};

const getLatestReleases = async () => {
  const token = getInput('github-token');

  const octokit = getOctokit(token);

  const releases = await octokit.rest.repos.listReleases({
    owner: context.repo.owner,
    repo: context.repo.repo,
  });

  console.log(releases);
};

try {
  console.log(`Hello user!`);
  const changelog = fs.readFileSync('./CHANGELOG.md', 'utf8');

  const parser = new MarkdownIt();

  const AST = parser.parse(changelog, {});
  parseChangelogAST(AST);

  getLatestReleases();

  // const payload = JSON.stringify(githubContext.payload, undefined, 2);
  // console.log(`The event payload: ${payload}`);
} catch (error) {
  setFailed(error.message);
}
