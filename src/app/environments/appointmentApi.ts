export const appointmentApi = {
    production: false,
    todayAppointments: '/api/HospitalAppointment/GetTodaysAppointments',
    allAppointments: '/api/HospitalAppointment/GetAllAppointments',
    addAppointments: '/api/HospitalAppointment/AddNewAppointment',
    deleteAppointments: '/api/HospitalAppointment/DeleteAppointmentByAppointment',
    markAppointments: '/api/HospitalAppointment/MarkAppointmentDone',
}