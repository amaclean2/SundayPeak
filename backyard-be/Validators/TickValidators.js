import { body } from "express-validator";

export const tickCreateValidator = () => {
    return [
        body('id_from_token')
            .not().isEmpty()
            .withMessage('notLoggedIn')
            .customSanitizer((value, { req }) => {
                req.body.user_id = value;
            }),
        body('adventure_id')
            .not().isEmpty(),
        body('public')
            .isBoolean()
            .customSanitizer((value) => {
                return (value === true) ? 1 : 0;
            })
    ];
};

export const tickGetValidatorByAdventure = () => {
    return [
        body('adventure_id')
            .not().isEmpty(),
        body('id_from_token')
            .not().isEmpty()
            .withMessage('notLoggedIn')
            .customSanitizer((value, { req }) => {
                req.body.user_id = value;
            })
    ]
}