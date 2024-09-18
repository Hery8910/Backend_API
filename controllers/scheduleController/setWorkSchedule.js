const setWorkSchedule = async (req, res, next) => {
    const { clientId, startTime, duration } = req.body; 
  
    try {
      const workSchedule = await WorkSchedule.findOne({ clientId });
      
      if (!workSchedule) {
        return res.status(404).json({ message: 'Work schedule not found' });
      }
  
      const availability = calculateAvailability(workSchedule, startTime, duration);
  
      const isAvailable = availability.some(block => {
        const blockDuration = (block.end - block.start) / (1000 * 60 * 60);  
        return blockDuration >= duration;  
      });
  
      if (isAvailable) {
        res.status(200).json({ available: true });
      } else {
        res.status(400).json({ available: false, message: 'Insufficient time available' });
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      res.status(500).json({ message: 'Error checking availability' });
    }
  }

module.exports = {  setWorkSchedule };
