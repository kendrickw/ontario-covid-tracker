module.exports = {
  auth: {
    // Enabling auth will disable graphql interface due to CSRF violation
    enable: false,
    https: false,
    jwt: {
      secret: 'sup3r_s3cr3t_t0k3n_d3v',
    },
  },
};
