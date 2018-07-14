import * as core from '@agrarium/core';
import * as src from '@agrarium/src';
export { Plugin } from '@agrarium/plugin';
export { PluginDTS } from '@agrarium/plugin-dts';
export { PluginMarkdown } from '@agrarium/plugin-markdown';

export const agrarium = { ...core, src  };
