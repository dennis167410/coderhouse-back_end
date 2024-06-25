import cron from 'node-cron';

//Cambiar esto:
import userModel from '../dao/model/user.model.js';
//import {UserService} from '../repository/index.js';

//const userService = new UserService();

// Función para eliminar usuarios inactivos
const deleteInactiveUsers = async () => {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    try {
        const result = await userModel.deleteMany({ last_connection: { $lt: thirtyMinutesAgo } });
        let fecha = new Date();
        console.log("Fecha actual = " + fecha)
        console.log(`${result.deletedCount} usuarios inactivos eliminados.`);
    } catch (error) {
        console.error('Error al eliminar usuarios inactivos:', error);
    }
};

const setupCronJobs = () => {
    // La tarea para que se ejecute cada minuto
    cron.schedule('* * * * *', deleteInactiveUsers);
    console.log('Tarea cron configurada para eliminar usuarios inactivos cada minuto.');
};

export default setupCronJobs;
