import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppointmentService } from '../../../services/appointment.service';
import { Appointment } from '../../../models/GetAllAppointments.model';


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
}
