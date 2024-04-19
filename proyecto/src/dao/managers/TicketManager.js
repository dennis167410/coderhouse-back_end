import ticketModel from '../model/ticket.model.js';


export default class TicketManager {
    constructor(dao){
        this.dao = dao; 
    }

    addTicket = async (amount,purchaser) => {
        try{
           let quantity = await ticketModel.countDocuments();
           const newTicket = {code: ++quantity, amount,purchaser};

           let retorno = await ticketModel.insertMany(newTicket);
           return retorno;
        }catch(error){
            console.log("Error: ", error);
        }
    }

    getTickets = async() => {
        try{
            let tickets = await userModel.find();
            return tickets;
        }catch(error){
            console.log("Error, ", error);
        }
    }

    getTicketById = async(tId) => { 
        try{
            const ticketData = await ticketModel.findById({_id: tId})
            
            if(!ticketData){
               return null;
            }
    
            return ticketData;
    
        }catch(error){
            console.log("Error ", error)
        }
    }
}