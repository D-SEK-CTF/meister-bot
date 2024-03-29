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

`ADMIN_ROLE_ID`: The ID of the roles that should be able to create new CTFs. Simply go to the discord chanel, right-click on the role and select "Copy Role ID" to find the value.

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

Arguments surrounded by `<>` are required, arguments surrounded by `[]` are optional. All commands support the use of whitespaces, by surrounding the argument with matching citation marks (`"` or `'`).

### Help

Lists all available commands together with their arguments.

```
meister help
```

### New CTF
Creates a new CTF, and a chanel called "discussion" under it.

If provided, the url, username, and password will be included in the chanel topic in the discussion chanel.
```
meister new ctf <CTF-NAME> [CTF-URL] [USERNAME] [PASSWORD]
```

NOTE: Directly after creation, the category is moved up to the second position in the category list. This is fitting for the flägermeister discord, but will likely have to be changed for other servers.

### New challenge
Creates a new challenge under a specified CTF. If no CTF name is provided, it will implicitly choose the mother category that the command was typed in.

The CTF name is matched via a non-case-sensitive search.
```
meister new chall <CHALL-NAME> [CTF-NAME]
```

### Solve challenge
Marks a challenge as solved, and accepts an argument for the flag used to solve the challenge.

Solved challenges are named `{challnName}-✅`
```
meister solved <FLAG>
```

### Test access privileges
Tests if the user is a member of the admin group. This is more of a testing command included for legacy reasons.

Below are the privileges required for each command:
| Attribute   | Value  |
|-------------|--------|
| archive     | admin  |
| new chall   | none   |
| new ctf     | admin  |
| solved      | none   |
| test role   | none   |
| help        | none   |

```
meister testrole
```

### Archive CTF
Archives a CTF. This means a couple things:
- All CTF channels become read-only
- The category is renamed to `{categoryName} (archived)`
- The category is moved down to the other archived CTFs (or the bottom if none exist)
```
meister archive ctf [CTF-NAME]
```