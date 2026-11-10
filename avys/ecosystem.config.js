// pm2 process config for running avys on the server (behind Caddy).
// Secrets live in avys/.env on the server, which is never committed.
module.exports = {
  apps: [
    {
      name: 'avys',
      script: 'index.js',
      cwd: __dirname,
      node_args: '--env-file=.env',
      max_memory_restart: '250M'
    }
  ]
}
