import { body } from "express-validator";

export const activityCreateValidator = () => {
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

export const activityGetValidatorByAdventure = () => {
    return [
        body('adventure_id')
            .not().isEmpty()
    ];
}

export const activityGetValidatorByUser = () => {
    return [
        body('id_from_token')
            .not().isEmpty()
            .withMessage('notLoggedIn')
            .customSanitizer((value, { req }) => {
                req.body.user_id = value;
            })
    ]
}