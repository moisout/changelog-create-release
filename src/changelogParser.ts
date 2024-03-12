import semver from 'semver';
import { Changelog } from './types/Changelog';
import { ParsedChangelog } from './types/ParsedChangelog';

export const parseChangelogAST = (AST: Changelog): ParsedChangelog => {
  const parsedVersions = AST.map((element, index) => {
    const previousElement = AST[index - 1];
    const nextElement2 = AST[index + 2];

    if (
      previousElement?.type === 'heading_open' &&
      previousElement?.tag === 'h2' &&
      nextElement2
    ) {
      if (element.content !== '[Unreleased]') {
        if (!element.children?.[1]) {
          throw new Error(
            `Version ${element.content} is not a link. Make sure you complete the link section at the bottom of CHANGELOG.md`
          );
        }

        const version = element.children[1].content?.split('-')?.[0];
        const semverVersion = semver.parse(version).version;
        const parsedVersion = {
          version: semverVersion,
          content: '',
        };

        for (let i = index + 2; i < AST.length; i++) {
          const element = AST[i];

          if (element.type === 'heading_open' && element.tag === 'h2') {
            break;
          }

          if (element.type === 'heading_close') {
            parsedVersion.content += '\n';
          } else {
            if (
              !(
                element.type.includes('bullet_list') ||
                element.type.includes('list_item_close')
              )
            ) {
              if (element.type.includes('paragraph_close')) {
                parsedVersion.content += '\n';
              } else {
                let spacing = '';

                if (element.content.length > 0) {
                  spacing = ' ';
                }

                parsedVersion.content += `${element.markup}${spacing}${element.content}`;
              }
            }
          }
        }
        return parsedVersion;
      }
    }
  })
    .filter(Boolean)
    .sort((a, b) => semver.compare(b.version, a.version));

  return parsedVersions[0];
};
