# Getting started
Go to
```https://discord.com/developers/applications```
and create a new application.
Add bot **Intents** and create an url under **Oath2 URL generator**
Invite bot to server through link.

Create a `.env` file, and add the following lines:
```
DISCORD_BOT_TOKEN=<DISCORD_BOT_TOKEN>
ADMIN_ROLE_ID=<ADMIN_ROLE_ID>
```
`DISCORD_BOT_TOKEN`: The secret token for the bot. Can be found after creating a new bot at https://discord.com/developers/applications.

`ADMIN_ROLE_ID`: The ID of the roles that should be able to create new CTFs. Simply go to the discord channel, right-click on the role and select "Copy Role ID" to find the value.

**NOTE**: More information on how to create a discord bot can be found here: https://discordpy.readthedocs.io/en/stable/discord.html

## Quick Start

### Development

Install node dependencies:
```bash
$> npm install --also=dev
```

Install pre-commit hooks:
```
$> npx husky install
```

Start the dev container:
```bash
$> docker compose up
```

### Production

No need to install dependencies, just start the prod container:
```bash
$> docker compose -f docker-compose-prod.yml up
```

## Usage

The meister bot can be interacted with through discord.
The following commands are available (and possibly more depending on how often this README is updated).

List available commands:
```
meister help
```

Create new CTF category:
```
meister new ctf <CTF-NAME> [CTF-URL] [USERNAME] [PASSWORD]
```

Create new challenge under existing CTF:
```
meister new chall <CHALL-NAME>
```

Solve challenge under existing CTF:
```
meister solved <FLAG>
```

Test access privileges:
```
meister testrole
```

Archive old ctf:
```
meister archive ctf
```