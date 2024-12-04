import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Patients } from '../../../models/GetAllPatients.model';
import { PatientService } from '../../../services/patient.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { country } from '../../../environments/country';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { images } from '../../../environments/image';
import { patientApi } from '../../../environments/patientApi';


@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxMaskDirective], 
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css'],
  providers: [PatientService, provideNgxMask()]
})
export class PatientDetailsComponent implements OnInit {
  @Input() patient: Patients | null = null;
  editMode: boolean = false;
  country: string[] = country.country;
  userPhoto = images.userPhoto;
  imgId = images.imgId;
  imgName = images.imgName;
  imgPhone = images.imgPhone;
  imgCountry = images.imgCountry;
  imgAge = images.imgAge;
  imgGender = images.imgGender;
  imgCreate = images.imgCreate;
  imgSave = images.imgSave;
  imgCancel = images.imgCancel;
  imgDelete = images.imgDelete;
  firstName: string = ''; 
  lastName: string = '';

  constructor(private patientService: PatientService, private http: HttpClient) { }

  updatePatient() {
    if (!this.patient) return;

    this.patient.name = `${this.firstName.trim()} ${this.lastName.trim()}`;
    
    const url = patientApi.updateApiUrl;
    const updatedPatient = { ...this.patient };

    this.http.put(url, updatedPatient).subscribe(
      () => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Kullanıcı bilgisi başarıyla güncellendi!",
          showConfirmButton: false,
          timer: 1500
        });
        this.editMode = false;
      },
      (error) => {
        console.error('Hasta bilgileri güncellenirken hata oluştu:', error);
        alert('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    );
  }

  deletePatient() {
    if (this.patient && typeof this.patient.patientId === 'number') {
      Swal.fire({
        title: 'Emin misiniz?',
        text: `${this.patient.name} adlı hasta silinecek!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Evet, sil!',
        cancelButtonText: 'Hayır',
      }).then((result) => {
        if (result.isConfirmed) {
          this.patientService.deletePatientById(this.patient!.patientId).subscribe(
            () => {
              Swal.fire({
                icon: 'success',
                title: 'Hasta başarıyla silindi!',
                showConfirmButton: false,
                timer: 1500,
              }).then(() => {
                window.location.reload();
              });
            },
            (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Silme işlemi başarısız!',
                text: 'Lütfen tekrar deneyin.',
              });
              console.error('Hata Detayları:', error);
            }
          );
        }
      });
    } else {
      console.error('Geçersiz hasta bilgisi veya patientId');
    }
  }
  
  ngOnInit() {
    if (this.patient) {
      const [firstName, lastName] = this.patient.name.split(' ');
      this.firstName = firstName || '';
      this.lastName = lastName || '';
    }
  }

  
}