// Registry of collectors. To add a source, create a file that exports
// `SOURCE` and `collect()` and add it to this array.

import * as hn from './hn.js';
import * as github from './github.js';

export const collectors = [hn, github];
