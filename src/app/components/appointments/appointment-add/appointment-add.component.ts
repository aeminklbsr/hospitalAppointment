import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../services/patient.service';
import { AppointmentService } from '../../../services/appointment.service';
import { Patients } from '../../../models/GetAllPatients.model';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TIME_SLOTS } from '../../../environments/time';

@Component({
  selector: 'app-appointment-add',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './appointment-add.component.html',
  styleUrls: ['./appointment-add.component.css'],
  providers: [PatientService, AppointmentService]
})
export class AppointmentAddComponent implements OnInit {
  patients: Patients[] = [];
  selectedPatient: Patients | null = null;
  appointmentTime: string = '';
  appointmentDate: string = '';
  naration: string = '';
  timeSlots = TIME_SLOTS;
  searchQuery: string = '';
  filteredPatients: Patients[] = [];
  isDropdownVisible: boolean = false;
  
  constructor(
    private patientService: PatientService,
    private appointmentService: AppointmentService
  ) { }

  ngOnInit() {
    this.patientService.getAllPatient().subscribe(
      (data) => {
        this.patients = data;
      },
      (error) => console.error('Hastalar alınırken hata oluştu:', error)
    );
  }

  onPatientSelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    const patientId = Number(target.value);
    const matchedPatient = this.patients.find((patient) => Number(patient.patientId) === patientId);
    this.selectedPatient = matchedPatient || null;
  }

  saveAppointment() {
    if (!this.selectedPatient || !this.appointmentTime || !this.naration) {
      Swal.fire({
        icon: 'warning',
        title: 'Eksik Bilgi',
        text: 'Lütfen tüm bilgileri doldurun.',
        showConfirmButton: false,
        timer: 1500,
      });

      console.error("Eksik bilgi. Gönderilen veriler:", {
        selectedPatient: this.selectedPatient,
        appointmentTime: this.appointmentTime,
        naration: this.naration,
      });
      return;
    }

    const selectedDate = this.appointmentDate;
    if (!selectedDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Tarih Seçimi Eksik',
        text: 'Lütfen bir tarih seçiniz.',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    const newAppointment = {
      name: this.selectedPatient.name,
      mobileNo: this.selectedPatient.mobileNo,
      city: this.selectedPatient.city,
      age: Number(this.selectedPatient.age),
      gender: this.selectedPatient.gender,
      appointmentTime: this.appointmentTime,
      naration: this.naration,
      appointmentDate: `${selectedDate}T00:00:00.000Z`,
    };

    this.appointmentService.addNewAppointment(newAppointment).subscribe(
      (response) => {
        Swal.fire({
          title: 'Randevu Başarıyla Oluşturuldu',
          html: `
            <div>
              <p><b>Hasta Adı:</b> ${newAppointment.name}</p>
              <p><b>Tarih:</b> ${selectedDate}</p>
              <p><b>Randevu Saati:</b> ${newAppointment.appointmentTime}</p>
              <p><b>Şikayet:</b> ${newAppointment.naration}</p>
            </div>
          `,
          icon: 'success',
          confirmButtonText: 'Tamam',
        }).then(() => {
          this.resetForm();
        });
      },
      (error) => {
        console.error('Randevu eklenirken hata oluştu:', error);
        Swal.fire({
          icon: 'error',
          title: 'Hata',
          text: 'Randevu kaydedilirken bir sorun oluştu. Lütfen tekrar deneyin.',
          showConfirmButton: true,
        });
      }
    );
  }

  resetForm() {
    this.selectedPatient = null;
    this.appointmentTime = '';
    this.naration = '';
    this.appointmentDate = '';
    this.searchQuery = '';
    this.isDropdownVisible = false;
  }

  clearForm() {
    this.selectedPatient = null;
    this.appointmentTime = '';
    this.naration = '';
  }

  onPatientSearch() {
    const query = this.searchQuery.toLowerCase();
    this.filteredPatients = this.patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(query) ||
        patient.patientId.toString().includes(query)
    );
    this.showDropdown();
  }

  selectPatient(patient: Patients) {
    this.selectedPatient = patient;
    this.searchQuery = patient.name;
    this.hideDropdown();
  }

  showDropdown() {
    this.isDropdownVisible = true;
  }

  hideDropdown() {
    setTimeout(() => (this.isDropdownVisible = false), 200);
  }
}