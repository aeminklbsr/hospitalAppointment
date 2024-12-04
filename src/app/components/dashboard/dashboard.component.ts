import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DashboardService } from '../../services/dashboard.service';
import { GetDashboardData } from '../../models/GetDashboardData.model';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/GetAllAppointments.model';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
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
    events: []
  };
  dashboardData: GetDashboardData[] = [];
  todayAppointments: Appointment[] = [];
  selectedAppointment: Appointment | null = null;

  constructor(
    private dashboardService: DashboardService,
    private appointmentService: AppointmentService
  ) { }

  ngOnInit() {
    this.dashboardService.getDashboardData().subscribe(
      (data) => {
        this.dashboardData = data;
      },
      (error) => console.error('Veri alınırken hata oluştu:', error)
    );

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
    Swal.fire({
      title: 'Emin misiniz?',
      text: 'Bu randevuyu tamamlandı olarak işaretlemek istediğinize emin misiniz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet, tamamlandı olarak işaretle!',
      cancelButtonText: 'İptal',
    }).then((result) => {
      if (result.isConfirmed) {
        this.appointmentService.markAppointmentDone(appointmentId).subscribe(
          (response) => {
            console.log('Randevu tamamlandı:', response);
  
            if (response.result) {
              Swal.fire({
                icon: 'success',
                title: 'Başarılı',
                text: 'Randevu tamamlandı olarak işaretlendi.',
                timer: 1500,
                showConfirmButton: false,
              }).then(() => {
                window.location.reload();
              });

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
    });
  }
}