# Github Releaser
Bump version, generate changelog with issue links, commit, tag, push and create Github release, all automatically.

## Idea
1. Find issues in repo with a certain label (e.g. coded, bug)
	- Iterate through open issues on repo, and check the `labels` property.

2. Bump version in package.
	- Use `conventional-recommended-bump` to get `major | minor | patch`
	- Use this to create a correct version
	- If `--append` parameter, stick parameter on the end.

3. Add to changelog.
	- Adds the version and the issues included in this release

4. Create a commit and tag.

5. Push to remote.
	- Push to the branch you are currently on
	- Push tags
	- Create a release with contents of changelog on Github

## Usage
```bash
$ node github-release.js <options>
 
Options
--version-append, -a  Append a string to your version
--issues, -i  Comma separated list of issue labels to include in release
--publish, -p  Publish to remote & create Github release
--token, -t  Github auth token
--dry-run, -dr  Do everything but don't actually do it
```