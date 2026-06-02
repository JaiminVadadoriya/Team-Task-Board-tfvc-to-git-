# Git Exercises

Use these drills after the team has completed a few normal feature branches.

## Exercise 1: Recover Deleted Work

Scenario: a developer accidentally deletes a file and needs to recover it.

Practice:

```bash
git reflog
git restore
git checkout
```

## Exercise 2: Revert A Bad Change

Scenario: a bug is introduced and must be backed out safely.

Practice:

```bash
git revert
```

## Exercise 3: Cherry-Pick

Scenario: a fix from `develop` must be applied to a release branch.

Practice:

```bash
git cherry-pick
```

## Exercise 4: Interactive Rebase

Scenario: clean up ten small commits before merging.

Practice:

```bash
git rebase -i
```

## Optional Chaos Day

Near the end of the workshop:

- Create conflicting changes.
- Force a revert.
- Introduce merge conflicts.
- Simulate a production hotfix.

The goal is to expose the team to stressful Git situations while the stakes are low.
