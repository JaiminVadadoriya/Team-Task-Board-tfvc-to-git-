import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

export type TaskStatus = 0 | 1 | 2;

export interface BoardUser {
  id: number;
  name: string;
}

export interface BoardTask {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  assignedUserId: number;
}

export interface TaskRequest {
  title: string;
  description: string;
  status: TaskStatus;
  assignedUserId: number;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(AppConfigService);

  private get base(): string {
    return this.configService.apiBase;
  }

  getUsers(): Observable<BoardUser[]> {
    return this.http.get<BoardUser[]>(`${this.base}/users`);
  }

  getTasks(): Observable<BoardTask[]> {
    return this.http.get<BoardTask[]>(`${this.base}/tasks`);
  }

  createTask(request: TaskRequest): Observable<BoardTask> {
    return this.http.post<BoardTask>(`${this.base}/tasks`, request);
  }

  updateTask(id: number, request: TaskRequest): Observable<BoardTask> {
    return this.http.put<BoardTask>(`${this.base}/tasks/${id}`, request);
  }

  updateStatus(id: number, status: TaskStatus): Observable<BoardTask> {
    return this.http.patch<BoardTask>(`${this.base}/tasks/${id}/status`, { status });
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/tasks/${id}`);
  }
}
