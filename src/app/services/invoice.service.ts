// src/app/services/invoice.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Invoice } from '../invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = 'http://localhost:8070/api';

  constructor(private http: HttpClient) {}

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/invoices`).pipe(
      catchError(this.handleError)
    );
  }

  addInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}/invoices`, invoice).pipe(
      catchError(this.handleError)
    );
  }

  updateInvoice(id: string, invoice: Invoice): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.apiUrl}/invoices/${id}`, invoice).pipe(
      catchError(this.handleError)
    );
  }

  deleteInvoice(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/invoices/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  exportReport(format: 'CSV' | 'PDF' | 'JSON', report?: any): Observable<Blob> {
    if (report) {
      return this.http.post(`${this.apiUrl}/financial/report/export?format=${format}`, report, {
        responseType: 'blob'
      }).pipe(
        catchError(this.handleError)
      );
    } else {
      return this.http.get(`${this.apiUrl}/export/invoices/${format.toLowerCase()}`, {
        responseType: 'blob'
      }).pipe(
        catchError(this.handleError)
      );
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue. Veuillez réessayer plus tard.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  // Filtrer par département
  filterByDepartment(department: string): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/invoices/filter/department?department=${department}`).pipe(
      catchError(this.handleError)
    );
  }

  // Filtrer par projet
  filterByProject(project: string): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/invoices/filter/project?project=${project}`).pipe(
      catchError(this.handleError)
    );
  }

  // Filtrer par plage de dates
  filterByDateRange(startDate: string, endDate: string): Observable<Invoice[]> {
    const url = `${this.apiUrl}/invoices/filter/date-range?startDate=${startDate}&endDate=${endDate}`;
    return this.http.get<Invoice[]>(url).pipe(
      catchError(this.handleError)
    );
  }
}