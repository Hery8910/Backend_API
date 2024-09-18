
const calculateAvailableSlots = (workSchedule, requiredHours) => {
    const availableSlots = [];
    const startHour = parseInt(workSchedule.startTime.split(':')[0]);
    const endHour = parseInt(workSchedule.endTime.split(':')[0]);
  

    for (let day of workSchedule.days) {
      let start = startHour;
  
      while (start + requiredHours <= endHour) {
        availableSlots.push({
          date: day,
          time: `${start}:00 - ${start + requiredHours}:00`,
          duration: requiredHours
        });
        start += requiredHours;
      }
    }
  
    return availableSlots;
  };