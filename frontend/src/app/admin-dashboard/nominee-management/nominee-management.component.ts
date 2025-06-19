import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Nominee } from '../../models/nominee.model';
import { ToastrService } from 'ngx-toastr';
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'app-nominee-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './nominee-management.component.html',
  styleUrls: ['./nominee-management.component.scss']
})
export class NomineeManagementComponent {
  searchTerm = '';
  selectedCategory = 'all';
  showDialog = false;
  showEditDialog = false;

  constructor(
    private nomineeService: ApiService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadNominees();
  }

  // Nominee
  newNominee: Nominee = {
    nomineeId: '',
    playerName: '',
    clubName: '',
    category: '',
    description: '',
    votes: 0,
    status: 'pending',
    photo: undefined,
  };
  nominees: Nominee[] = [];

  categories: string[] = [
    'Fans d\'or Femenin',
    'Fans d\'or Masculin',
    'Fans d\'or Podcast',
    'Fans d\'or Publication',
    'Fans d\'or Vicente del Bosque',
    'Fans d\'or Presenter',
    'Fans d\'or Chaine YouTube',
    'Fans d\'or Journalist',
    'Fans d\'or Broadcaster',
    'Fans d\'or Fan Loyal',
    'Fans d\'or Equipe Feminine',
    'Fans d\'or Equipe Masculine',
  ];

  openDialog(): void {
    this.newNominee = {
      nomineeId: '',
      playerName: '',
      clubName: '',
      category: '',
      description: '',
      votes: 0,
      status: 'pending',
      photo: undefined,
    };
    this.showDialog = true;
  }

  closeDialog(): void {
    this.showDialog = false;
  }

  addNominee(): void {
    const nomineeToSubmit: Nominee = {
      ...this.newNominee,
      nomineeId: '',
      votes: 0,
      status: 'active'
    };

    this.nomineeService.addNominee(nomineeToSubmit).subscribe({
      next: () => {
        this.loadNominees();
        this.toastr.success('Nominee added successfully!', 'Success');
        this.closeDialog();
      },
      error: err => {
        console.error('Error adding nominee', err);
        this.toastr.error('Failed to add nominee.', 'Error');
      }
    });
  }
  editNomineeData: Nominee = {
    nomineeId: '',
    playerName: '',
    clubName: '',
    category: '',
    description: '',
    votes: 0,
    status: 'pending'
  };

  get filteredNominees(): Nominee[] {
    return this.nominees.filter(nominee =>
      nominee.playerName.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (this.selectedCategory === 'all' || nominee.category === this.selectedCategory)
    );
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  // Delete nominee
  deleteNominee(id: string): void {
    if (!confirm('Are you sure you want to delete this nominee?')) return;
    if (!id) {
      console.error('Invalid nominee ID for deletion');
      return;
    }

    this.nomineeService.deleteNominee(id).subscribe({
      next: () => {
        this.toastr.success('Nominee deleted successfully!', 'Deleted');
        this.loadNominees();
      },
      error: err => {
        console.error('Failed to delete nominee', err);
        this.toastr.error('Failed to delete nominee.', 'Error');
      }
    });
  }

  // Edit nominee
  editNominee(nominee: Nominee): void {
    this.editNomineeData = { ...nominee };
    this.showEditDialog = true;
  }
  closeEditDialog(): void {
    this.showEditDialog = false;
  }
  updateNominee(): void {
    if (!this.editNomineeData.nomineeId) {
      console.error('Missing nominee ID');
      this.toastr.error('Nominee ID missing. Cannot update.', 'Error');
      return;
    }

    // Create a copy of the object without the votes field
    const updatedNominee = { ...this.editNomineeData } as any;
    delete updatedNominee.votes;
    // Remove 'votes' before sending it to the backend

    this.nomineeService.updateNominee(updatedNominee.nomineeId, updatedNominee).subscribe({
      next: () => {
        this.toastr.success('Nominee updated successfully!', 'Updated');
        this.loadNominees();
        this.closeEditDialog();
      },
      error: err => {
        console.error('Error updating nominee', err);
        this.toastr.error('Failed to update nominee.', 'Error');
      }
    });
  }


  onSearchChange(term: string): void {
    this.searchTerm = term;
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
  }

  //  Resize and encode the image to Base64 in Angular before upload (client-side)
  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 300;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        this.newNominee.photo = canvas.toDataURL('image/jpeg');  // Base64 output
      };
    };
  }
  onEditPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 300;
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        this.editNomineeData.photo = canvas.toDataURL('image/jpeg');
      };
    };
  }

  loadNominees(): void {
    this.nomineeService.getAllNominees().subscribe({
      next: (data: any[]) => {
        this.nominees = data.map(item => ({
          ...item,
          id: item.nomineeId // 🟢 map backend field to expected Angular field
        }));
      },
      error: err => console.error('Failed to load nominees', err)
    });
  }


}
