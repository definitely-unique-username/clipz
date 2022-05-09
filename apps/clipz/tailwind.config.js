const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind');
const { join } = require('path');

module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  safelist: ['bg-blue-400', 'bg-green-400', 'bg-red-400'],
  theme: {
    extend: {},
  },
  plugins: [],
};
