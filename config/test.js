const PORT = 9999;

module.exports = {
  app: {
    port: PORT,
  },
  auth: {
    enable: false,
    jwt: {
      secret: 'sup3r_s3cr3t_t0k3n_t3st',
    },
  },
};
