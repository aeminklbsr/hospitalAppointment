import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppointmentService } from '../../../services/appointment.service';
import { Appointment } from '../../../models/GetAllAppointments.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css'],
  providers: [AppointmentService]
})
export class AppointmentListComponent implements OnInit {

  appointmentData: Appointment[] = [];
  filteredAppointmentData: Appointment[] = [];
  pageSize: number = 10; // Sayfa başına gösterilecek öğe sayısı

  constructor(private AppointmentService: AppointmentService ) { }

  ngOnInit() {
    this.AppointmentService.getAllAppointments().subscribe(
      (data) => {
        this.appointmentData = data;
        this.updateFilteredData();
      },
      (error) => console.error('Veri alınırken hata oluştu:', error)
    );
  }

  updateFilteredData() {
    // Sayfa başına gösterilecek veriyi ayarla
    this.filteredAppointmentData =
      this.pageSize === -1
        ? this.appointmentData
        : this.appointmentData.slice(0, this.pageSize);
  }

  onPageSizeChange(event: any) {
    const selectedValue = event.target.value;
    this.pageSize = selectedValue === 'Tümü' ? -1 : Number(selectedValue);
    this.updateFilteredData();
  }

  deleteAppointment(appointmentId: number) {
    Swal.fire({
      title: "Emin misiniz?",
      text: "Bu işlem geri alınamaz!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Evet, sil!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.AppointmentService.deleteAppointment(appointmentId).subscribe(
          (response) => {
            console.log('Silme işlemi başarılı:', response);
  
            // Silinen randevuyu listeden kaldır
            this.appointmentData = this.appointmentData.filter(
              (appointment) => appointment.appointmentId !== appointmentId
            );
            this.updateFilteredData(); // Listeyi güncelle
  
            Swal.fire({
              title: "Silindi!",
              text: "Randevu başarıyla silindi.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false
            });
          },
          (error) => {
            console.error('Randevu silinirken hata oluştu:', error);
  
            Swal.fire({
              title: "Hata!",
              text: "Randevu silinirken bir hata oluştu.",
              icon: "error"
            });
          }
        );
      }
    });
  }
}
