import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService, BoardTask, BoardUser, TaskStatus } from './task.service';

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
export class App implements OnInit {
  private readonly taskService = inject(TaskService);

  readonly users = signal<BoardUser[]>([]);
  readonly tasks = signal<BoardTask[]>([]);
  readonly form = signal<TaskForm>(this.blankForm());
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly statuses: { value: TaskStatus; label: string; icon: string }[] = [
    { value: 0, label: 'To Do', icon: '○' },
    { value: 1, label: 'In Progress', icon: '◑' },
    { value: 2, label: 'Done', icon: '●' },
  ];

  readonly dashboard = computed(() => {
    const tasks = this.tasks();
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === 0).length,
      inProgress: tasks.filter((t) => t.status === 1).length,
      done: tasks.filter((t) => t.status === 2).length,
    };
  });

  readonly columns = computed(() =>
    this.statuses.map((status) => ({
      ...status,
      tasks: this.tasks().filter((t) => t.status === status.value),
    })),
  );

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);
    this.error.set(null);

    this.taskService.getUsers().subscribe({
      next: (users) => this.users.set(users),
      error: () => this.setError(),
    });

    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: () => {
        this.setError();
        this.loading.set(false);
      },
    });
  }

  saveTask(): void {
    const form = this.form();
    const title = form.title.trim();
    if (!title) return;

    const request = {
      title,
      description: form.description.trim(),
      status: form.status,
      assignedUserId: Number(form.assignedUserId),
    };

    if (form.id === null) {
      this.taskService.createTask(request).subscribe({
        next: (task) => {
          this.tasks.update((tasks) => [...tasks, task]);
          this.resetForm();
        },
        error: () => this.setError(),
      });
    } else {
      this.taskService.updateTask(form.id, request).subscribe({
        next: (updated) => {
          this.tasks.update((tasks) => tasks.map((t) => (t.id === updated.id ? updated : t)));
          this.resetForm();
        },
        error: () => this.setError(),
      });
    }
  }

  editTask(task: BoardTask): void {
    this.form.set({ ...task });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks.update((tasks) => tasks.filter((t) => t.id !== taskId));
        if (this.form().id === taskId) this.resetForm();
      },
      error: () => this.setError(),
    });
  }

  changeStatusFromInput(task: BoardTask, value: string): void {
    const status = Number(value) as TaskStatus;
    this.taskService.updateStatus(task.id, status).subscribe({
      next: (updated) => {
        this.tasks.update((tasks) => tasks.map((t) => (t.id === updated.id ? updated : t)));
      },
      error: () => this.setError(),
    });
  }

  setFormStatus(value: string): void {
    this.form.update((current) => ({ ...current, status: Number(value) as TaskStatus }));
  }

  setAssignedUser(value: string): void {
    this.form.update((current) => ({ ...current, assignedUserId: Number(value) }));
  }

  assignedUser(userId: number): BoardUser | undefined {
    return this.users().find((u) => u.id === Number(userId));
  }

  initials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  statusClass(status: TaskStatus): string {
    return ['status-todo', 'status-inprogress', 'status-done'][status] ?? '';
  }

  dismissError(): void {
    this.error.set(null);
  }

  resetForm(): void {
    this.form.set(this.blankForm());
  }

  private blankForm(): TaskForm {
    return { id: null, title: '', description: '', status: 0, assignedUserId: 1 };
  }

  private setError(): void {
    this.error.set('Something went wrong. Is the API running on port 5013?');
  }
}
