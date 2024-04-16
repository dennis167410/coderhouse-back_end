import ticketModel from '../model/ticket.model.js';


export default class TicketManager {
    constructor(dao){
        this.dao = dao; 
    }

    addTicket = async (ticketData) => {
        try{
            let newTicket = await ticketModel.create({ticketData});
            return newTicket;
        }catch(error){
            console.log("Error: ", error);
        }
    }
}