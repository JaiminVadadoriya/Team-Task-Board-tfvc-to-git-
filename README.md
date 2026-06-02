# Team Task Board

A small ASP.NET Core and Angular project for practicing Git workflows in a low-risk codebase.

The application is intentionally simple: teams create, edit, delete, assign, and move tasks across `To Do`, `In Progress`, and `Done`. The real goal is learning how to branch, commit, push, review, merge, resolve conflicts, and recover from mistakes.

## Project Structure

```text
TaskBoard/
├── backend/
│   └── TaskBoard.Api
├── frontend/
│   └── taskboard-ui
├── docs/
└── README.md
```

## Run The API

```bash
cd backend/TaskBoard.Api
dotnet run
```

The API exposes task and user endpoints under `/api`.

## Run The UI

```bash
cd frontend/taskboard-ui
npm start
```

Open `http://localhost:4200`.

## Learning Flow

Use this repo across three short sprints:

| Sprint | Product work | Git focus |
| --- | --- | --- |
| 1 | Task model, task list, create task | Clone, branch, commit, push, pull request |
| 2 | Edit, delete, status updates | Reviews, merge vs rebase, pulling latest changes |
| 3 | User assignment, dashboard | Conflicts, release branches, cherry-pick, revert |

See [docs/git-training-plan.md](docs/git-training-plan.md) for the full workshop plan.

## Suggested Branches

```text
main
  └── develop
       ├── feature/task-api
       ├── feature/task-list
       ├── feature/task-edit
       └── feature/user-assignment
```

Protect `main` and `develop` so work lands through pull requests.
