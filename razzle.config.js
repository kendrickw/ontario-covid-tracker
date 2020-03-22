'use strict';
const path = require('path');

module.exports = {
  plugins: [
    {
      name: 'typescript',
      options: {
        useBabel: true,
      },
    },
    {
      name: 'scss',
      options: {},
    },
  ],

  modify: (config, { target, dev }) => {
    config.resolve.alias = {
      '~': path.join(process.cwd(), 'src'),
    };

    return config;
  },
};
