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
  selectedPatient: Patients | null = null; // Seçilen hasta
  appointmentTime: string = ''; // Randevu saati
  appointmentDate: string = '';
  naration: string = ''; // Şikayet
  timeSlots = TIME_SLOTS; // Saat listesini değişkene ata
  searchQuery: string = ''; // Arama sorgusu
  filteredPatients: Patients[] = [];
  isDropdownVisible: boolean = false; // Dropdown görünürlüğü
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
    const patientId = Number(target.value); // ID'yi sayıya dönüştür

    // Seçilen hastayı bul ve konsolda kontrol et
    const matchedPatient = this.patients.find((patient) => Number(patient.patientId) === patientId);

    // Hasta bulunursa atama yap
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
  
    // Seçilen tarih (date inputundan gelen)
    const selectedDate = this.appointmentDate; // YYYY-MM-DD formatında tarih
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
  
    // API'ye gönderilecek veri
    const newAppointment = {
      name: this.selectedPatient.name,
      mobileNo: this.selectedPatient.mobileNo,
      city: this.selectedPatient.city,
      age: Number(this.selectedPatient.age),
      gender: this.selectedPatient.gender,
      appointmentTime: this.appointmentTime,
      naration: this.naration,
      appointmentDate: `${selectedDate}T00:00:00.000Z`, // Seçilen tarihi ISO formatına çevirme
    };
  
  
    // API çağrısı
    this.appointmentService.addNewAppointment(newAppointment).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Başarılı',
          text: 'Randevu başarıyla kaydedildi.',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.reload(); // Sayfayı yeniler
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
  
  // Formu sıfırlama fonksiyonu
  resetForm() {
    this.selectedPatient = null;
    this.appointmentTime = '';
    this.naration = '';
    this.appointmentDate = '';
    this.searchQuery = ''; // Hasta arama inputunu temizle
  this.isDropdownVisible = false; // Dropdown'u gizle
  }

  clearForm() {
    this.selectedPatient = null;
    this.appointmentTime = '';
    this.naration = '';
  }

  // Arama işlemi
  onPatientSearch() {
    const query = this.searchQuery.toLowerCase();
    this.filteredPatients = this.patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(query) ||
        patient.patientId.toString().includes(query)
    );
    this.showDropdown();
  }

  // Hasta seçimi
  selectPatient(patient: Patients) {
    this.selectedPatient = patient;
    this.searchQuery = patient.name; // Seçilen hastayı input alanına yaz
    this.hideDropdown(); // Dropdown'u gizle
  }

  // Dropdown görünürlüğü kontrolü
  showDropdown() {
    this.isDropdownVisible = true;
  }

  hideDropdown() {
    setTimeout(() => (this.isDropdownVisible = false), 200); // Biraz gecikme ekle
  }
}