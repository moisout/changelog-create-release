export type Changelog = ChangelogElement[];

interface ChangelogElement {
  type: string;
  tag: string;
  attrs: any;
  map?: number[];
  nesting: number;
  level: number;
  children?: Children[];
  content: string;
  markup: string;
  info: string;
  meta: any;
  block: boolean;
  hidden: boolean;
}

interface Children {
  type: string;
  tag: string;
  attrs?: string[][];
  map: any;
  nesting: number;
  level: number;
  children: any;
  content: string;
  markup: string;
  info: string;
  meta: any;
  block: boolean;
  hidden: boolean;
}
