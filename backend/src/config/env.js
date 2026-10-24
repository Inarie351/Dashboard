require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT, 10) || 8080,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY,
  openWeatherBaseUrl: process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5',
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  githubCallbackUrl:
    process.env.GITHUB_OAUTH_CALLBACK_URL ||
    'http://localhost:8080/api/services/github/oauth/callback',
  credentialsEncryptionKey: process.env.CREDENTIALS_ENCRYPTION_KEY,
  spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
  spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  youtubeClientId: process.env.YOUTUBE_CLIENT_ID,
  youtubeClientSecret: process.env.YOUTUBE_CLIENT_SECRET,
  youtubeOauthCallbackUrl:
    process.env.YOUTUBE_OAUTH_CALLBACK_URL ||
    'http://localhost:8080/api/services/youtube/oauth/callback',
  // Spotify rejects a plain "localhost" redirect URI as insecure — it has to be the loopback IP,
  // 127.0.0.1, instead. Same machine, same port, just a different hostname Spotify will accept.
  spotifyOauthCallbackUrl:
    process.env.SPOTIFY_OAUTH_CALLBACK_URL ||
    'http://127.0.0.1:8080/api/services/spotify/oauth/callback',
  pinterestClientId: process.env.PINTEREST_CLIENT_ID,
  pinterestClientSecret: process.env.PINTEREST_CLIENT_SECRET,
  pinterestOauthCallbackUrl:
    process.env.PINTEREST_OAUTH_CALLBACK_URL ||
    'http://localhost:8080/api/services/pinterest/oauth/callback',
  // Defaults target the MailHog service in docker-compose.yml — a fake SMTP server with a web
  // inbox at http://localhost:8025, so confirmation emails "arrive" without any real credentials.
  // Point these at a real SMTP provider (e.g. a Gmail app password, SendGrid, Mailgun) to send
  // actual emails instead.
  smtpHost: process.env.SMTP_HOST || 'mailhog',
  smtpPort: parseInt(process.env.SMTP_PORT, 10) || 1025,
  smtpUser: process.env.SMTP_USER || undefined,
  smtpPass: process.env.SMTP_PASS || undefined,
  mailFrom: process.env.MAIL_FROM || 'Dashboard <no-reply@dashboard.local>',
  // Emails in this list are promoted to ADMIN on registration — the only way to bootstrap the
  // first admin account, since nothing in the app itself can grant that role.
  adminEmails: (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
};
