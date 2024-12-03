import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DashboardService } from '../../services/dashboard.service';
import { GetDashboardData } from '../../models/GetDashboardData.model';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/GetAllAppointments.model';
import { FullCalendarModule } from '@fullcalendar/angular'; // FullCalendar modülü
import dayGridPlugin from '@fullcalendar/daygrid'; // FullCalendar dayGrid eklentisi
import { CalendarOptions } from '@fullcalendar/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FullCalendarModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DashboardService, AppointmentService]
})
export class DashboardComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    events: [] // Randevuları buraya ekleyeceğiz
  };

  dashboardData: GetDashboardData[] = [];
  todayAppointments: Appointment[] = [];
  selectedAppointment: Appointment | null = null;

  constructor(
    private dashboardService: DashboardService,
    private appointmentService: AppointmentService
  ) { }

  ngOnInit() {
    // Dashboard verilerini çek
    this.dashboardService.getDashboardData().subscribe(
      (data) => {
        this.dashboardData = data;
      },
      (error) => console.error('Veri alınırken hata oluştu:', error)
    );

    // Bugünkü randevuları çek
    this.appointmentService.getTodayAppointments().subscribe(
      (appointments) => {
        this.todayAppointments = appointments;
        this.populateCalendarEvents();
      },
      (error) => console.error('Randevular alınırken hata oluştu:', error)
    );
  }

  populateCalendarEvents() {
    this.calendarOptions.events = this.todayAppointments.map(appointment => ({
      title: appointment.name,
      date: appointment.appointmentDate,
      extendedProps: {
        time: appointment.appointmentTime,
        isDone: appointment.isDone
      }
    }));
  }
  

  toggleDetails(index: number): void {
    this.selectedAppointment = this.todayAppointments[index];
  }

  openModal(appointment: Appointment): void {
    this.selectedAppointment = appointment;
  }

  closeModal(): void {
    this.selectedAppointment = null;
  }

  markAsDone(appointmentId: number, index: number) {
    this.appointmentService.markAppointmentDone(appointmentId).subscribe(
      (response) => {
        console.log('Randevu tamamlandı:', response);
  
        if (response.result) {
          Swal.fire({
            icon: 'success',
            title: 'Başarılı',
            text: 'Randevu tamamlandı olarak işaretlendi.',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            window.location.reload(); // Sayfayı yeniler
          });
  
          // Randevunun durumunu güncelle
          this.todayAppointments[index].isDone = true;
        }
      },
      (error) => {
        console.error('Randevu tamamlanırken hata oluştu:', error);
        Swal.fire({
          icon: 'error',
          title: 'Hata',
          text: 'Randevu tamamlanırken bir sorun oluştu.',
        });
      }
    );
  }
}