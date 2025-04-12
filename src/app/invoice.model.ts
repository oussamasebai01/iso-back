export interface Invoice {
    id?: string; // Optionnel, car généré par le backend
    invoiceNumber: string;
    vendorName: string;
    amount: number;
    invoiceDate: string; // Format ISO (ex: "2025-01-15")
    dueDate: string; // Format ISO
    description: string;
    status: 'NEW' | 'VALIDATED' | 'REJECTED' | 'ARCHIVED' | 'PENDING'; // Enum côté backend
    rejectionReason?: string | null;
    validatedBy?: string | null;
    validationDate?: string | null;
    archiveDate?: string | null;
    budget: number;
    depense: number;
    gainAnnuel?: number;
    department: string;
    project: string;
  }