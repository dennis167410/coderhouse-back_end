
import {Router} from 'express';
//import handlePolicies from '../middleware/handle-policies.middleware.js';
import TicketCtrol from '../controlador/ticket.controller.js';


// SOLO PARA TEST
const ticketCtrol = new TicketCtrol();

const router = Router();

router.post('/', ticketCtrol.addTicket)

router.get('/', ticketCtrol.getTickets)

router.get('/:ticketId', ticketCtrol.getTicketById);

/*
router.get('/', handlePolicies(["PUBLIC"]), ticketCtrol.getTickets)
router.get('/:ticketId', handlePolicies(['USER', 'ADMIN']), ticketCtrol.getTicketById);
*/

export default router;