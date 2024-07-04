import cron from 'node-cron';

//Cambiar esto:
import userModel from '../dao/model/user.model.js';
//import {UserService} from '../repository/index.js';

import { sendEmail } from '../routing/email.routes.js';


//const userService = new UserService();

// Función para eliminar usuarios inactivos
const deleteInactiveUsers = async () => {
   // const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000); // 30 minutos
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 días

   // const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2hs
    try {

        const usersToDelete = await userModel.find({ last_connection: { $lt: twoDaysAgo} });
        
        console.log(usersToDelete)

        if (usersToDelete.length > 0) {
            // Enviar correos electrónicos a los usuarios
            usersToDelete.forEach(user => {
                sendEmail(
                    user.email,
                    "Cuenta Eliminada por Inactividad",
                    `Hola ${user.first_name}, tu cuenta ha sido eliminada por inactividad.`
                );
            });
        }
       // const result = await userModel.deleteMany({ last_connection: { $lt: thirtyMinutesAgo } })
        const result = await userModel.deleteMany({ last_connection: { $lt: twoDaysAgo} });
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
    console.log('Tarea cron configurada para eliminar usuarios inactivos, se ejecuta cada minuto.');
};

export default setupCronJobs;
