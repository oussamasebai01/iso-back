import { Component, ElementRef, Renderer2, AfterViewInit, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RelasationService } from './../../relasation.service';
import { catchError, Observable, throwError } from 'rxjs';
import { Invoice } from 'src/app/invoice.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  filterValues = {
    startDate: '',
    endDate: '',
    department: '',
    project: '',
    searchTerm: ''
  };
  
  resetFilters() {
    this.filterValues = {
      startDate: '',
      endDate: '',
      department: '',
      project: '',
      searchTerm: ''
    };
    this.filteredInvoices = [...this.invoices]; // ou tu relances un appel à ton backend si besoin
  }
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  invoiceForm: FormGroup;
  isEditMode: boolean = false;
  selectedInvoiceId: string | null = null;
  searchTerm: string = '';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private fb: FormBuilder,
    private invoiceService: InvoiceService
  ) {
    this.invoiceForm = this.fb.group({
      invoiceNumber: ['', Validators.required],
      vendorName: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      invoiceDate: ['', Validators.required],
      dueDate: ['', Validators.required],
      description: ['', Validators.required],
      status: ['PENDING', Validators.required],
      budget: [null, [Validators.min(0)]],
      depense: [null, [Validators.min(0)]],
      gainAnnuel: [null, [Validators.min(0)]],
      department: [''],
      project: ['']
    });
  }

  ngOnInit() {
    this.loadInvoices();
  }

  ngAfterViewInit(): void {
    const list = this.el.nativeElement.querySelectorAll('.navigation li');
    list.forEach((item: any) => {
      this.renderer.listen(item, 'mouseover', () => {
        this.removeHoveredClass(list);
        this.renderer.addClass(item, 'hovered');
      });
    });

    const toggle = this.el.nativeElement.querySelector('.toggle');
    const navigation = this.el.nativeElement.querySelector('.navigation');
    const main = this.el.nativeElement.querySelector('.main');

    this.renderer.listen(toggle, 'click', () => {
      if (navigation.classList.contains('active')) {
        this.renderer.removeClass(navigation, 'active');
        this.renderer.removeClass(main, 'active');
      } else {
        this.renderer.addClass(navigation, 'active');
        this.renderer.addClass(main, 'active');
      }
    });
  }

  private removeHoveredClass(list: any): void {
    list.forEach((item: any) => {
      this.renderer.removeClass(item, 'hovered');
    });
  }

  loadInvoices() {
    this.invoiceService.getInvoices().subscribe({
      next: (invoices: Invoice[]) => {
        this.invoices = invoices;
        this.filteredInvoices = [...this.invoices];
      },
      error: (err: any) => {
       
        console.error('Erreur lors du chargement des factures :', err);
      }
    });
  }

  onSubmit() {
    if (this.invoiceForm.invalid) {
      
      return;
    }

    const invoiceData: Invoice = this.invoiceForm.value;

    if (this.isEditMode && this.selectedInvoiceId) {
      this.invoiceService.updateInvoice(this.selectedInvoiceId, invoiceData).subscribe({
        next: (updatedInvoice: Invoice) => {
          const index = this.invoices.findIndex(inv => inv.id === this.selectedInvoiceId);
          if (index !== -1) {
            this.invoices[index] = updatedInvoice;
            this.filterInvoices();
          }
         
          this.resetForm();
        },
        error: (err: any) => {
          
          console.error('Erreur lors de la mise à jour :', err);
          this.loadInvoices();
        }
      });
    } else {
      this.invoiceService.addInvoice(invoiceData).subscribe({
        next: (newInvoice: Invoice) => {
          this.invoices.push(newInvoice);
          this.filterInvoices();
         
          this.resetForm();
        },
        error: (err: any) => {
          
          console.error('Erreur lors de l’ajout :', err);
          this.loadInvoices();
        }
      });
    }
  }

  editInvoice(invoice: Invoice) {
    this.isEditMode = true;
    this.selectedInvoiceId = invoice.id || null;
    this.invoiceForm.patchValue({
      ...invoice,
      invoiceDate: invoice.invoiceDate.split('T')[0],
      dueDate: invoice.dueDate.split('T')[0]
    });
  }

  deleteInvoice(id: string) {
    if (confirm('Voulez-vous vraiment supprimer cette facture ?')) {
      this.invoiceService.deleteInvoice(id).subscribe({
        next: () => {
          this.invoices = this.invoices.filter(inv => inv.id !== id);
          this.filterInvoices();
         
        },
        error: (err: any) => {
          
          console.error('Erreur lors de la suppression :', err);
          this.loadInvoices();
        }
      });
    }
  }

  applyFilters(values: any) {
    const { startDate, endDate, department, project, searchTerm } = values;

    // Si tous les filtres combinés sont remplis, utiliser le filtre combiné
    if (startDate && endDate && !department && !project) {
      this.invoiceService.filterByDateRange(startDate, endDate).subscribe({
        next: (invoices) => {
          this.filteredInvoices = invoices;
        },
        error: (err) => {
          console.error('Erreur lors du filtrage par plage de dates :', err);
        }
      });
    }
    // Sinon, appliquer les filtres individuellement
    else {
      let filtered = [...this.invoices];

      // Filtrer par département
      if (department) {
        this.invoiceService.filterByDepartment(department).subscribe({
          next: (invoices) => {
            filtered = invoices;
            this.filteredInvoices = filtered;
          
          },
          error: (err) => {
    
            console.error('Erreur lors du filtrage par département :', err);
          }
        });
      }
      // Filtrer par projet
      else if (project) {
        this.invoiceService.filterByProject(project).subscribe({
          next: (invoices) => {
            filtered = invoices;
            this.filteredInvoices = filtered;
          },
          error: (err) => {
            console.error('Erreur lors du filtrage par projet :', err);
          }
        });
      }
    
      else {
        this.filteredInvoices = [...this.invoices];
      }
    }
  }

  resetForm() {
    this.isEditMode = false;
    this.selectedInvoiceId = null;
    this.invoiceForm.reset({
      invoiceNumber: '',
      vendorName: '',
      amount: 0,
      invoiceDate: '',
      dueDate: '',
      description: '',
      status: 'PENDING'
    });
  }

  exportReport(format: 'CSV' | 'PDF' | 'JSON', report?: any) {
    this.invoiceService.exportReport(format, report).subscribe({
      next: (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoices.${format.toLowerCase()}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      
      },
      error: (err: any) => {
       
        console.error(`Erreur lors de l’exportation ${format} :`, err);
      }
    });
  }

  filterInvoices() {
    if (!this.searchTerm) {
      this.filteredInvoices = [...this.invoices];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredInvoices = this.invoices.filter(invoice =>
        (invoice.invoiceNumber?.toLowerCase().includes(term) || false) ||
        (invoice.vendorName?.toLowerCase().includes(term) || false) ||
        (invoice.status?.toLowerCase().includes(term) || false) ||
        (invoice.description?.toLowerCase().includes(term) || false)
      );
    }
  }
}