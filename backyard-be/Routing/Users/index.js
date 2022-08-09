import { Router } from 'express';
import { userCreateValidator, userLoginValidator } from '../../Validators/UserValidators';
import { NOT_FOUND } from '../../ErrorHandling/statuses';
import {
    createUser,
    deleteUser,
    followUser,
    getLoggedInUser,
    getUserById,
    loginUser,
    resetPassword,
    savePasswordReset,
    refetchUser
} from '../../Handlers/Users';

const router = Router();

router.get('/id', getUserById);
router.get('/loggedIn', getLoggedInUser);
router.get('/follow', followUser);
router.get('/refetch', refetchUser);

router.post('/login', userLoginValidator(), loginUser);
router.post('/resetPassword', resetPassword);
router.post('/create', userCreateValidator(), createUser);
router.post('/savePasswordReset', savePasswordReset);

router.delete('/delete', deleteUser);

router.put('/edit', (req, res) => {
    res.status(NOT_FOUND).json({
        message: 'API to be created'
    });
});

router.use('/', (req, res) => {
    res.status(NOT_FOUND).json({
        message: 'Please select a method on /users',
        status: NOT_FOUND
    });
});

export default router;