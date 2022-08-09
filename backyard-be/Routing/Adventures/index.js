import { Router } from 'express';
import { adventureCreateValidator, adventuresGetValidator } from '../../Validators/AdventureValidators';
import { createNewAdventure, deleteAdventure, getAdventureDetails, getAllAdventures } from '../../Handlers/Adventures';
import { NOT_FOUND } from '../../ErrorHandling/statuses';

const router = Router();

router.get('/details', getAdventureDetails);
router.post('/all', adventuresGetValidator(), getAllAdventures);
router.post('/create', adventureCreateValidator(), createNewAdventure);
router.delete('/delete', deleteAdventure);

router.put('/edit', (req, res) => {
    res.status(NOT_FOUND).json({
        message: 'API to be created'
    });
});

router.use('/', (req, res) => {
    res.status(NOT_FOUND).json({
        data: {
            message: 'Please select a method on /adventurtes',
            status: NOT_FOUND
        }
    })
})

export default router;