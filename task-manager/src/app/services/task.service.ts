import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Task } from '../models/task.model';

const DEFAULT_API_URL = 'https://task-manager-with-copilot-server-535572860478.europe-west1.run.app/api/tasks';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiUrl = DEFAULT_API_URL;
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  private extractData<T>(res: ApiResponse<T> | T): { data: T; message: string } {
    if (res && typeof res === 'object' && 'message' in res && 'data' in res) {
      return { data: (res as ApiResponse<T>).data, message: (res as ApiResponse<T>).message };
    }
    return { data: res as T, message: 'Success' };
  }

  getAllTasks(): Observable<{ tasks: Task[]; message: string }> {
    return this.http.get<ApiResponse<Task[]> | Task[]>(this.apiUrl).pipe(
      map(res => {
        const { data, message } = this.extractData(res);
        return { tasks: data || [], message };
      })
    );
  }

  createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Observable<{ task: Task; message: string }> {
    return this.http.post<ApiResponse<Task>>(this.apiUrl, task, { headers: this.headers }).pipe(
      map(res => {
        const { data, message } = this.extractData(res);
        return { task: data, message };
      })
    );
  }

  updateTask(id: number, task: Partial<Task>): Observable<{ task: Task; message: string }> {
    return this.http.put<ApiResponse<Task>>(`${this.apiUrl}/${id}`, task, { headers: this.headers }).pipe(
      map(res => {
        const { data, message } = this.extractData(res);
        return { task: data, message };
      })
    );
  }

  deleteTask(id: number): Observable<{ message: string }> {
    return this.http.delete<ApiResponse<null> | null>(`${this.apiUrl}/${id}`).pipe(
      map(res => {
        if (res && typeof res === 'object' && 'message' in res) {
          return { message: (res as ApiResponse<null>).message };
        }
        return { message: 'Task deleted successfully' };
      })
    );
  }
}
