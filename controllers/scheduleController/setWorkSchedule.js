const WorkSchedule = require('../../models/WorkSchedule'); 

const setWorkSchedule = async (req, res, next) => {
  const { clientId, days, startTime, endTime } = req.body;  

  try {
    let workSchedule = await WorkSchedule.findOne({ clientId });

    if (!workSchedule) {
      workSchedule = new WorkSchedule({
        clientId,
        days,
        startTime,
        endTime,
      });

      await workSchedule.save();
      return res.status(201).json({ message: 'Work schedule created successfully', workSchedule });
    }

    // Si existe, actualizar el horario de trabajo
    workSchedule.days = days;
    workSchedule.startTime = startTime;
    workSchedule.endTime = endTime;

    await workSchedule.save();  // Guardar los cambios en la base de datos

    res.status(200).json({ message: 'Work schedule updated successfully', workSchedule });
  } catch (error) {
    console.error('Error setting work schedule:', error);
    res.status(500).json({ message: 'Error setting work schedule', error });
  }
};

module.exports = { setWorkSchedule };
