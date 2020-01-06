# awesomejs-backend

## Project setup

```
yarn install
```

### Env

Create a `.env.local` file next to this `README.md` with the necessary secret variables:

```
DB_SECRET=xxxxxxxxxxxxxxxxxxxxx
GITHUB_AUTH=xxxxxxxxxxxxxxxxxxxxx
COOKIE_SECRET=xxxxxxxxxxxxxxxxxxxxx
ALGOLIA_ID=xxxxxxxxxxxxxxxxxxxxx
ALGOLIA_KEY=xxxxxxxxxxxxxxxxxxxxx
OAUTH_GITHUB_ID=xxxxxxxxxxxxxxxxxxxxx
OAUTH_GITHUB_SECRET=xxxxxxxxxxxxxxxxxxxxx
OAUTH_GITHUB_CALLBACK=http://localhost:4040/auth/github/callback
```

- `DB_SECRET` must be a valid FaunaDB secret
- `GITHUB_AUTH` mush be a valid GitHub personal access token
- `COOKIE_SECRET` must be a random string, ideally pretty long
- `ALGOLIA_ID` is the Algolia application ID
- `ALGOLIA_KEY` is the Algolia Admin API key
- `OAUTH_GITHUB_ID` is the OAuth Client ID
- `OAUTH_GITHUB_SECRET` is the OAuth Secret

### Customize configuration
See [Configuration Reference](https://github.com/Akryum/nodepack).
