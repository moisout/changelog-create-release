import { Changelog } from './types/Changelog';
import { ParsedChangelog } from './types/ParsedChangelog';

export const parseChangelogAST = (AST: Changelog) => {
  let latestVersion: ParsedChangelog;

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

  return latestVersion;
};
