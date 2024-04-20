import {TicketService} from '../repository/index.js';

export default class TicketController{
    ticketService;
    constructor(){
        this.ticketService = TicketService;
    }

    getTickets = async(req, res) => {
        try{
            let tickets = await this.ticketService.getTickets();
            return res.json({message: "Tickets registrados ", Tickets: tickets});
    
        }catch(error){
            console.log("Error, ", error);
        }
    }

    getTicketById = async(req, res) => { 
        try{
            const tId = req.params.userId;
    
            const ticketData = await this.ticketService.getTicketById(tId);
            
            if(!ticketData || ticketData === null){
               return res.status(404).json({message: "Ticket no encontrado"})
            }
    
            return res.json({message: "Ticket ", ticket: ticketData});
    
        }catch(error){
            console.log("Error ", error)
        }
    }

    addTicket = async(req, res) => {    
      
        try{
          const ticketBody = req.body;
        
          const ticket = await this.ticketService.addTicket(ticketBody);
      
          if(!ticket || ticket === null){
            return res.status(404).json({message: "Error, no se pudo cerrar el ticket de la compra."})
         }
      
      //////////
          return res.json({
            message: "Éxito, se cerro correctamente la comptra.",
            ticket: ticket
          })
      
        }catch(error){
          console.log("Erro al intentar agregar el carrito al usuario. ", error);
        }
      }
}