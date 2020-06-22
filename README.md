# Github Releaser
My custom github releaser / changelog generator / versioner.

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

5. Argument option to push to remote (which creates a Release on Github, with the generated changelog contents)

## Arguments
* `--publish` = commit, tag, push to remote and create github release
* `--dry-run` = do everything but don't actually do it
* `--append` = append a string onto the end of your version (e.g. `-BETA`)