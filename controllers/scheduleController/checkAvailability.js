const WorkSchedule = require('../../models/WorkSchedule');

const checkAvailability = async (req, res) => {
    const { hours } = req.body; 
  
    try {
      const workSchedule = await WorkSchedule.findOne({ clientId: 'client-id' });
  
      const availableSlots = calculateAvailableSlots(workSchedule, hours);
  
      res.status(200).json({ slots: availableSlots });
    } catch (error) {
      res.status(500).json({ message: 'Error checking availability', error });
    }
  }
  
  const calculateAvailableSlots = (workSchedule, requiredHours) => {
    const availableSlots = [];
    const startHour = parseInt(workSchedule.startTime.split(':')[0]);
    const endHour = parseInt(workSchedule.endTime.split(':')[0]);
  
    // Supongamos que tenemos bloques de 2 horas cada día
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
  
 
  module.exports = { checkAvailability, };