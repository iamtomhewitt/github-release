# Github Releaser
Bump version, generate changelog with issue links, commit, tag, push and create Github release, all automatically.

<p align="center"><img src="demo/demo.gif"></p>	

The above will create an entry in `CHANGELOG.md` and a [release on Github](https://github.com/iamtomhewitt/github-releaser/releases/latest):

```markdown
## <version> (dd/mm/yyyy) 

### Issues in this release:

* [#IssueNumber](IssueTitle)
```

## Getting Started
```bash
npm install github-releaser
```

#### Add the api url to your `package.json`:
```json
"repository": {
    "apiUrl": "https://api.github.com/repos/<your username>/<your repo name>"
}
```

#### Add a script to your `package.json`:
```json
"scripts": {
    "release": "github-releaser"
}
```

#### Create a Github access token
It will be needed in order to fetch issues and create releases. It must have the **repo** scope applied.