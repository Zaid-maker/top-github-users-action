# Top GitHub Users Action <img src="https://github.githubassets.com/images/modules/site/features/actions-icon-actions.svg" height=48 width=48 /> [<img alt="Image of my-profile-views-counter" src="https://github.com/gayanvoice/my-profile-views-counter/blob/master/graph/373376349/small/week.png" height="20">](https://github.com/gayanvoice/my-profile-views-counter/blob/master/readme/373376349/week.md)
[![Image of my-profile-views-counter](https://github.com/gayanvoice/my-profile-views-counter/blob/master/svg/373376349/badge.svg)](https://github.com/gayanvoice/my-profile-views-counter/blob/master/readme/373376349/week.md)

> **DISCLAIMER**: This repository is a modernized fork of the original work by [gayanvoice](https://github.com/gayanvoice). The codebase has been updated with modern JavaScript practices, improved error handling, and current dependencies while maintaining the original functionality. This fork aims to ensure the project remains reliable and maintainable for future use.

A modern GitHub Action to track and analyze top GitHub users by country using the GitHub GraphQL API. This action generates detailed rankings and insights about the most active GitHub users in different countries. Visit [gayanvoice/top-github-users](https://github.com/gayanvoice/top-github-users) for the full list.

## Features

- 🌍 Track GitHub users by country and city
- 📊 Generate detailed user rankings based on:
  - Public contributions
  - Total contributions
  - Follower count
- 🔄 Automatic daily updates
- 📈 Caching for better performance
- 🎯 Configurable tracking parameters
- 📝 Markdown and HTML report generation

## How It Works

The action uses a modern, class-based architecture to efficiently track and analyze GitHub users:

1. **Configuration**: Countries and cities are defined in `config.json` using a JSON Schema for validation
2. **Data Collection**: Uses `@octokit/graphql` to fetch user data via GitHub's GraphQL API
3. **Caching**: Stores user data in `./cache` directory with country-specific JSON files
4. **Checkpointing**: Uses `checkpoint.json` to track progress and ensure reliable updates
5. **Report Generation**: Creates formatted markdown reports in `./docs` with user rankings

## Requirements

- Node.js 20.x or later
- GitHub Personal Access Token with required permissions
- GitHub Actions enabled repository

## Technologies

<table>
	<tr>
		<td>
			<a href="https://www.w3schools.com/js/">
				<img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg" height=96 width=96 />
			</a>
		</td>
		<td>
			<a href="https://github.com/features/actions">
				<img src="https://github.githubassets.com/images/modules/site/features/actions-icon-actions.svg" height=96 width=96 />
			</a>
		</td>
		<td>
			<a href="https://nodejs.org/en/">
				<img src="https://nodejs.org/static/images/logos/nodejs-new-pantone-white.svg" height=96 width=96 />
			</a>
		</td>
		<td>
			<a href="https://docs.github.com/en/graphql">
				<img src="https://upload.wikimedia.org/wikipedia/commons/1/17/GraphQL_Logo.svg" height=96 width=96 />
			</a>
		</td>
		<td>
			<a href="https://github.com/">
				<img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" height=96 width=96 />
			</a>
		</td>
	</tr>
</table>

## Setup Guide

### 1. Repository Setup
Create a new repository named `top-github-users`

### 2. Authentication Setup
1. Create a GitHub Personal Access Token (Classic) with these permissions:
   - `repo` (Full control)
   - `workflow`
   - `read:org`
   - `read:user`
2. Add the token as a repository secret:
   - Go to Settings → Secrets and variables → Actions
   - Create new secret
   - Name: `CUSTOM_TOKEN`
   - Value: Your personal access token

### 3. Configuration Files

Create these configuration files in your repository:

#### checkpoint.json
```json
{
  "checkpoint": 0
}
```

#### config.json
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "GitHub Users Monitor Configuration",
  "description": "Configuration for tracking top GitHub users by country",
  "version": "2.0.0",
  "settings": {
    "devMode": false,
    "minUsersThreshold": 750,
    "maxErrorIterations": 4,
    "updateFrequency": "daily"
  },
  "locations": [
    {
      "country": "afghanistan",
      "geoName": "Afghanistan",
      "cities": ["kabul", "kandahar", "herat", "kunduz", "lashkargah", "ghazni", "khost", "zaranj"],
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Afghanistan.svg"
    }
  ]
}
```

### 4. Workflow Setup

Create `.github/workflows/top-users.yml`:

```yaml
name: Top GitHub Users
on:
  schedule:
    - cron: '0 0 * * *'  # Runs daily at midnight
  workflow_dispatch:      # Allows manual triggers

jobs:
  update-users:
    name: Update GitHub Users Rankings
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - uses: gayanvoice/top-github-users-action@master
        env:
          CUSTOM_TOKEN: ${{ secrets.CUSTOM_TOKEN }}
```

## Configuration Options

The `config.json` file supports these settings:

```json
{
  "settings": {
    "devMode": false,           // Enable/disable development mode
    "minUsersThreshold": 750,   // Minimum users to track per country
    "maxErrorIterations": 4,    // Max retry attempts on error
    "updateFrequency": "daily"  // Update frequency
  }
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

<table>
	<tr>
		<td>
			Don't forget to star ⭐ this repository
		</td>
	</tr>
</table>
