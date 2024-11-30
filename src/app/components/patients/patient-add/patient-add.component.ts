import { Component, EventEmitter, OnInit, Output } from '@angular/core'; // Output ve EventEmitter eklendi
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PatientService } from '../../../services/patient.service';
import { Patients } from '../../../models/GetAllPatients.model';
import { country } from '../../../environments/country';
import Swal from 'sweetalert2';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-patient-add',
  templateUrl: './patient-add.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgxMaskDirective],
  styleUrls: ['./patient-add.component.css'],
  providers: [PatientService, provideNgxMask()]
})
export class PatientAddComponent implements OnInit {
  @Output() patientAdded = new EventEmitter<Patients>(); // Yeni hasta eklendiğinde parent'a veri göndermek için
  country: string[] = country.country;
  firstName: string = '';
  lastName: string = '';
  patient: Patients = {
    patientId: '',
    name: '',
    mobileNo: '',
    city: '',
    age: '',
    gender: '',
  };

  constructor(private patientService: PatientService) {}

  ngOnInit() {}

  addPatient() {
    this.patient.patientId = 0; // Backend varsayılan bir değer bekliyorsa
    this.patient.name = `${this.firstName.trim()} ${this.lastName.trim()}`; // Trim ile boşlukları temizler
    this.patientService.addNewPatient(this.patient).subscribe(
      (response) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Hasta başarıyla eklendi.",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.reload(); // Sayfayı yeniler
        });
      },
      (error) => {
        console.error('Hata Detayları:', error.error); // Hata mesajını kontrol et
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Hasta eklenirken bir sorun oluştu.",
          showConfirmButton: false,
          timer: 1500
        });
      }
    );
  }
}