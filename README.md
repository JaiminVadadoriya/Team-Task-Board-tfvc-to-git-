# Team Task Board

A small ASP.NET Core and Angular project for practising Git workflows in a low-risk codebase.

The application is intentionally simple: teams create, edit, delete, assign, and move tasks across **To Do**, **In Progress**, and **Done**. The real goal is learning how to branch, commit, push, review, merge, resolve conflicts, and recover from mistakes.

---

## Project Structure

```text
TaskBoard/
├── backend/
│   └── TaskBoard.Api        ← ASP.NET Core Minimal API (.NET 10)
├── frontend/
│   └── taskboard-ui         ← Angular 21 SPA
├── docs/
│   ├── git-training-plan.md
│   ├── git-exercises.md
│   └── branch-protection.md
└── README.md
```

---

## Prerequisites

| Tool | Minimum version | Download |
|------|----------------|---------|
| .NET SDK | 10.0 | https://dot.net |
| Node.js | 20 LTS | https://nodejs.org |
| npm | 9+ | bundled with Node |

---

## Run the API

```bash
cd backend/TaskBoard.Api
dotnet run
```

The API starts on **http://localhost:5013** (HTTP) and **https://localhost:5001** (HTTPS).

Available endpoints:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/users` | List all users |
| GET | `/api/tasks` | List all tasks |
| GET | `/api/tasks/{id}` | Get a single task |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/{id}` | Update a task |
| PATCH | `/api/tasks/{id}/status` | Change status only |
| DELETE | `/api/tasks/{id}` | Delete a task |

OpenAPI spec: http://localhost:5013/openapi/v1.json

---

## Run the UI

```bash
cd frontend/taskboard-ui
npm install        # first time only
npm start
```

Open **http://localhost:4200**.

The UI connects to the API at `http://localhost:5013`. Start the API before the UI.

---

## Run both together (PowerShell)

```powershell
.\Start-TaskBoard.ps1
```

---

## Learning Flow

Use this repo across three short sprints:

| Sprint | Product work | Git focus |
|--------|-------------|-----------|
| 1 | Task model, task list, create task | Clone, branch, commit, push, pull request |
| 2 | Edit, delete, status updates | Reviews, merge vs rebase, pulling latest changes |
| 3 | User assignment, dashboard | Conflicts, release branches, cherry-pick, revert |

See the **docs/** folder for the full workshop material:

- [Git Training Plan](docs/git-training-plan.md) — sprint-by-sprint plan and phase breakdown
- [Git Exercises](docs/git-exercises.md) — hands-on drills (reflog, revert, cherry-pick, rebase)
- [Branch Protection](docs/branch-protection.md) — recommended GitHub ruleset settings

---

## Suggested Branch Structure

```text
main
  └── develop
       ├── feature/task-api
       ├── feature/task-list
       ├── feature/task-edit
       └── feature/user-assignment
```

Protect `main` (2 approvals) and `develop` (1 approval) so all work lands through pull requests.
