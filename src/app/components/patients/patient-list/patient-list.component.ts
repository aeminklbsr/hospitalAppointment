import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PatientService } from '../../../services/patient.service';
import { Patients } from '../../../models/GetAllPatients.model';
import { PatientDetailsComponent } from '../patient-details/patient-details.component';
import { PatientAddComponent } from '../patient-add/patient-add.component';


@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, PatientDetailsComponent,PatientAddComponent],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css'],
  providers: [PatientService],
})
export class PatientListComponent implements OnInit {
  patientData: Patients[] = [];
  filteredPatientData: Patients[] = [];
  pageSize: number = 10; // Sayfa başına gösterilecek öğe sayısı
  selectedPatient: Patients | null = null; // Seçilen hasta bilgisi
  showAddPatientModal: boolean = false; // Modal görünürlüğü

  constructor(private patientService: PatientService) {}

  ngOnInit() {
    // Hasta listesini API'den çek
    this.patientService.getAllPatient().subscribe(
      (data) => {
        this.patientData = data.reverse();
        this.updateFilteredData();
      },
      (error) => console.error('Veri alınırken hata oluştu:', error)
    );
  }

  updateFilteredData() {
    // Sayfa başına gösterilecek veriyi ayarla
    this.filteredPatientData =
      this.pageSize === -1
        ? this.patientData
        : this.patientData.slice(0, this.pageSize);
  }

  onPageSizeChange(event: any) {
    const selectedValue = event.target.value;
    this.pageSize = selectedValue === 'Tümü' ? -1 : Number(selectedValue);
    this.updateFilteredData();
  }

  // Hasta detaylarını aç
  openPatientDetails(patient: Patients) {
    this.selectedPatient = patient;
  }

  // Modalı kapat
  closePatientDetails() {
    this.selectedPatient = null;
  }

  openAddPatientModal() {
    this.showAddPatientModal = true; // Modal açılır
  }

  closeAddPatientModal() {
    this.showAddPatientModal = false; // Modal kapanır
  }

  onPatientAdded(newPatient: Patients) {
    this.patientData.unshift(newPatient); // Yeni hasta başa eklenir
    this.closeAddPatientModal(); // Modal kapanır
  }
}