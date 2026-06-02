# Git Training Plan

This project is designed around Git exercises rather than application complexity. Keep feature work small so each developer gets repeated practice with the same collaboration loop.

## Phase 1: Basic Git

Practice:

- Clone repository
- Create a branch
- Commit changes
- Push changes
- Create a pull request

Example work items:

| Developer | Task |
| --- | --- |
| Dev A | Create task model |
| Dev B | Create user model |
| Dev C | Create Angular home page |
| Dev D | Create navigation menu |

## Phase 2: Feature Branch Workflow

Introduce:

- `main`
- `develop`
- `feature/*` branches

Example:

```text
main
  └── develop
       ├── feature/task-api
       ├── feature/task-list
       ├── feature/task-edit
       └── feature/user-assignment
```

Practice:

- Branch from `develop`
- Merge through pull requests
- Resolve review comments

## Phase 3: Pull Requests And Reviews

Repository rules:

- Minimum 1 reviewer for `develop`
- Minimum 2 reviewers for `main`
- No direct commits to protected branches
- Meaningful PR descriptions

Developers learn:

- Review comments
- Requested changes
- Approvals
- Squash merges

## Phase 4: Merge Conflicts

Create intentional conflicts in files such as:

- `frontend/taskboard-ui/src/app/app.ts`
- `backend/TaskBoard.Api/Program.cs`

Exercises:

1. Pull latest changes.
2. Resolve conflicts locally.
3. Complete the merge.
4. Verify the application still works.

## Phase 5: Release Workflow

Use a lightweight release structure:

```text
main
develop
release/v1.0
hotfix/fix-task-validation
```

Practice:

- Creating release branches
- Applying bug fixes
- Creating hotfixes
- Tagging releases
