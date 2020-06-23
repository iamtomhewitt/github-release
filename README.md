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

5. Push to remote.
	- Push to the branch you are currently on
	- Push tags
	- Create a release with contents of changelog on Github

## Arguments
* `--version-append` = append a string onto the end of your version (e.g. `-BETA`)
* `--issues` = comma separated list of issue labels which should be included in the release (e.g. specifying `bug,fix` will search for issues with a label `bug` or `fix` and add it into the release) 
* `--publish` = push to remote and create github release
* `--dry-run` = do everything but don't actually do it