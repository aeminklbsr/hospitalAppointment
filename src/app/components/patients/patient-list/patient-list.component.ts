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
  pageSize: number = 10;
  selectedPatient: Patients | null = null; 
  showAddPatientModal: boolean = false;

  constructor(private patientService: PatientService) {}

  ngOnInit() {
    this.patientService.getAllPatient().subscribe(
      (data) => {
        this.patientData = data.reverse();
        this.updateFilteredData();
      },
      (error) => console.error('Veri alınırken hata oluştu:', error)
    );
  }

  updateFilteredData() {
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

  openPatientDetails(patient: Patients) {
    this.selectedPatient = patient;
  }

  closePatientDetails() {
    this.selectedPatient = null;
  }

  openAddPatientModal() {
    this.showAddPatientModal = true;
  }

  closeAddPatientModal() {
    this.showAddPatientModal = false;
  }

  onPatientAdded(newPatient: Patients) {
    this.patientData.unshift(newPatient); 
    this.closeAddPatientModal();
  }
}