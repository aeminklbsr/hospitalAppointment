import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PatientService } from '../../../services/patient.service';
import { Patients } from '../../../models/GetAllPatients.model';
import { country } from '../../../environments/country';
import Swal from 'sweetalert2';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { images } from '../../../environments/image';

@Component({
  selector: 'app-patient-add',
  templateUrl: './patient-add.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgxMaskDirective],
  styleUrls: ['./patient-add.component.css'],
  providers: [PatientService, provideNgxMask()]
})

export class PatientAddComponent implements OnInit {
  @Output() patientAdded = new EventEmitter<Patients>();
  country: string[] = country.country;
  firstName: string = '';
  lastName: string = '';
  imgName = images.imgName;
  imgPhone = images.imgPhone;
  imgCountry = images.imgCountry;
  imgAge = images.imgAge;
  imgGender = images.imgGender;
  patient: Patients = {
    patientId: '',
    name: '',
    mobileNo: '',
    city: '',
    age: '',
    gender: '',
  };

  constructor(private patientService: PatientService) { }

  ngOnInit() { }

  addPatient() {
    this.patient.patientId = 0;
    this.patient.name = `${this.firstName.trim()} ${this.lastName.trim()}`;
    this.patientService.addNewPatient(this.patient).subscribe(
      (response) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Hasta başarıyla eklendi.",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.reload();
        });
      },
      (error) => {
        console.error('Hata Detayları:', error.error);
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