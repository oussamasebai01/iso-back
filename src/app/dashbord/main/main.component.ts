import { Component, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RelasationService } from './../../relasation.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements AfterViewInit {
  invoices: any[] = []; // Liste complète des factures
  filteredInvoices: any[] = []; // Liste filtrée affichée dans le tableau
  invoice: any = {
    invoiceNumber: '',
    vendorName: '',
    amount: 0,
    invoiceDate: '',
    dueDate: '',
    description: '',
    status: 'PENDING'
  };
  isEditMode: boolean = false;
  selectedInvoiceId: string | null = null;
  searchTerm: string = ''; // Terme de recherche

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    public _get: RelasationService,
    private http: HttpClient
  ) {}

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
    this.http.get<any[]>('http://localhost:8070/api/invoices').subscribe(
      (res) => {
        this.invoices = res;
        this.filteredInvoices = [...this.invoices]; // Initialiser la liste filtrée avec toutes les factures
      },
      (err) => {
        console.error('Erreur lors du chargement des factures :', err);
      }
    );
  }

  onSubmit(formData: any) {
    if (this.isEditMode) {
      this.http.put(`http://localhost:8070/api/invoices/${this.selectedInvoiceId}`, formData).subscribe(
        (response: any) => {
          console.log('Facture mise à jour :', response);
          const index = this.invoices.findIndex(inv => inv.id === this.selectedInvoiceId);
          if (index !== -1) {
            this.invoices[index] = { ...response };
            this.filterInvoices(); // Mettre à jour le tableau filtré après modification
          }
          this.resetForm();
        },
        (error) => {
          console.error('Erreur lors de la mise à jour :', error);
          this.loadInvoices();
        }
      );
    } else {
      this.http.post('http://localhost:8070/api/invoices', formData).subscribe(
        (response: any) => {
          console.log('Facture ajoutée :', response);
          this.invoices.push(response);
          this.filterInvoices(); // Mettre à jour le tableau filtré après ajout
          this.resetForm();
        },
        (error) => {
          console.error('Erreur lors de l’ajout :', error);
          this.loadInvoices();
        }
      );
    }
  }

  editInvoice(invoice: any) {
    this.isEditMode = true;
    this.selectedInvoiceId = invoice.id;
    this.invoice = { ...invoice };
    this.invoice.invoiceDate = invoice.invoiceDate.split('T')[0];
    this.invoice.dueDate = invoice.dueDate.split('T')[0];
  }

  deleteInvoice(id: string) {
    if (confirm('Voulez-vous vraiment supprimer cette facture ?')) {
      this.http.delete(`http://localhost:8070/api/invoices/`).subscribe(
        (response) => {
          console.log('Facture supprimée :', response);
          this.invoices = this.invoices.filter(inv => inv.id !== id);
          this.filterInvoices(); // Mettre à jour le tableau filtré après suppression
        },
        (error) => {
          console.error('Erreur lors de la suppression :', error);
          this.loadInvoices();
        }
      );
    }
  }

  resetForm() {
    this.isEditMode = false;
    this.selectedInvoiceId = null;
    this.invoice = {
      invoiceNumber: '',
      vendorName: '',
      amount: 0,
      invoiceDate: '',
      dueDate: '',
      description: '',
      status: 'PENDING'
    };
  }

  exportToCsv() {
    this.http.get('http://localhost:8070/api/export/invoices/csv', { responseType: 'blob' }).subscribe(
      (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'invoices.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Erreur lors de l’exportation CSV :', error);
      }
    );
  }

  // Nouvelle méthode pour filtrer les factures
  filterInvoices() {
    if (!this.searchTerm) {
      this.filteredInvoices = [...this.invoices]; // Si le champ est vide, afficher toutes les factures
    } else {
      this.filteredInvoices = this.invoices.filter(invoice =>
        invoice.vendorName.toLowerCase().includes(this.searchTerm.toLowerCase())
      ); // Filtrer par vendorName (insensible à la casse)
    }
  }
}