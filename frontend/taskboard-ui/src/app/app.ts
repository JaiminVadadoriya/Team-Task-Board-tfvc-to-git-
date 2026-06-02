import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type TaskStatus = 0 | 1 | 2;

interface BoardUser {
  id: number;
  name: string;
}

interface BoardTask {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  assignedUserId: number;
}

interface TaskForm {
  id: number | null;
  title: string;
  description: string;
  status: TaskStatus;
  assignedUserId: number;
}

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly users = signal<BoardUser[]>([
    { id: 1, name: 'Avery Patel' },
    { id: 2, name: 'Jordan Lee' },
    { id: 3, name: 'Sam Rivera' },
    { id: 4, name: 'Taylor Kim' },
  ]);

  readonly tasks = signal<BoardTask[]>([
    {
      id: 1,
      title: 'Create task API',
      description: 'Expose endpoints for task CRUD.',
      status: 1,
      assignedUserId: 1,
    },
    {
      id: 2,
      title: 'Build task list',
      description: 'Show tasks grouped by status.',
      status: 0,
      assignedUserId: 2,
    },
    {
      id: 3,
      title: 'Draft PR template',
      description: 'Add a lightweight review checklist.',
      status: 2,
      assignedUserId: 3,
    },
  ]);

  readonly form = signal<TaskForm>(this.blankForm());
  readonly statuses: Array<{ value: TaskStatus; label: string }> = [
    { value: 0, label: 'To Do' },
    { value: 1, label: 'In Progress' },
    { value: 2, label: 'Done' },
  ];

  readonly dashboard = computed(() => {
    const tasks = this.tasks();
    return {
      total: tasks.length,
      todo: tasks.filter((task) => task.status === 0).length,
      inProgress: tasks.filter((task) => task.status === 1).length,
      done: tasks.filter((task) => task.status === 2).length,
    };
  });

  readonly columns = computed(() =>
    this.statuses.map((status) => ({
      ...status,
      tasks: this.tasks().filter((task) => task.status === status.value),
    })),
  );

  saveTask(): void {
    const form = this.form();
    const title = form.title.trim();

    if (!title) {
      return;
    }

    if (form.id === null) {
      const nextId = Math.max(0, ...this.tasks().map((task) => task.id)) + 1;
      this.tasks.update((tasks) => [
        ...tasks,
        {
          id: nextId,
          title,
          description: form.description.trim(),
          status: form.status,
          assignedUserId: Number(form.assignedUserId),
        },
      ]);
    } else {
      this.tasks.update((tasks) =>
        tasks.map((task) =>
          task.id === form.id
            ? {
                ...task,
                title,
                description: form.description.trim(),
                status: form.status,
                assignedUserId: Number(form.assignedUserId),
              }
            : task,
        ),
      );
    }

    this.resetForm();
  }

  editTask(task: BoardTask): void {
    this.form.set({ ...task });
  }

  deleteTask(taskId: number): void {
    this.tasks.update((tasks) => tasks.filter((task) => task.id !== taskId));

    if (this.form().id === taskId) {
      this.resetForm();
    }
  }

  changeStatus(task: BoardTask, status: TaskStatus): void {
    this.tasks.update((tasks) =>
      tasks.map((currentTask) =>
        currentTask.id === task.id ? { ...currentTask, status: Number(status) as TaskStatus } : currentTask,
      ),
    );
  }

  setFormStatus(value: string): void {
    this.form.update((current) => ({ ...current, status: Number(value) as TaskStatus }));
  }

  setAssignedUser(value: string): void {
    this.form.update((current) => ({ ...current, assignedUserId: Number(value) }));
  }

  changeStatusFromInput(task: BoardTask, value: string): void {
    this.changeStatus(task, Number(value) as TaskStatus);
  }

  assignedUserName(userId: number): string {
    return this.users().find((user) => user.id === Number(userId))?.name ?? 'Unassigned';
  }

  resetForm(): void {
    this.form.set(this.blankForm());
  }

  private blankForm(): TaskForm {
    return {
      id: null,
      title: '',
      description: '',
      status: 0,
      assignedUserId: 1,
    };
  }
}
