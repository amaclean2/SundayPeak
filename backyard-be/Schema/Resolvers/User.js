import { comparePassword, hashPassword } from '../../Crypto';
import { addUser, followUser } from '../../DB';
import { catchBlock, returnError } from '../../ErrorHandling';
import { buildUserObject } from '../../Handlers/Users.js';
import authService from '../../Services/auth.service.js';
import { sendEmail, validateSignatureAndSave } from '../../Services/resetPassword.service.js';

export const userResolvers = {
	Query: {
		login: async (parent, args) => {
			try {
				const { email, password } = args;
				const user = await buildUserObject({ email });

				if (comparePassword(password, user.password)) {
					delete user.password;
					const token = authService.issue({ id: user.id });

					console.log({ message: 'USER_LOGGED_IN', user, token });
					return { user, token };
				} else {
					throw returnError({ message: 'invalidPassword' });
				}
			} catch (error) {
				throw catchBlock({ message: 'serverLoginUser', error });
			}
		},

		getOtherUser: async (parent, args) => {
			const { id } = args;

			try {
				return await buildUserObject({ id });
			} catch (error) {
				throw catchBlock({ message: 'serverLoginUser', error });
			}
		},

		getUserFromToken: async (parent, args, context) => {
			try {
				const { user_id } = context;

				if (user_id) {
					return await buildUserObject({ id: user_id });
				} else {
					throw returnError({ message: 'notLoggedIn' });
				}
			} catch (error) {
				throw catchBlock({ message: 'serverLoginUser', error });
			}
		},

		resetPasswordEmail: async (parent, args) => {
			try {

				const { email } = args;
				const emailValidation = await sendEmail(email);

				console.log({ emailValidation });
				return { email };

			} catch (error) {
				throw catchBlock({ message: 'serverValidateUser', error });
			}
		},
	},

	Mutation: {
		createUser: async (parent, args) => {
			try {
				const newUser = {
					...args?.input,
					password: hashPassword(args?.input?.password)
				};

				if (!newUser.legal) {
					throw returnError({ message: 'missingLegal' });
				}

				const createdUser = await addUser(newUser);
				const { id } = createdUser;
				const token = authService.issue({ id });
				delete createdUser.password;

				console.log({ message: 'USER_CREATED', createdUser, token });
				return { user: createdUser, token };
			} catch (error) {
				throw catchBlock({ message: 'serverCreateUser', error });
			}
		},

		savePasswordReset: async (parent, args, context) => {
			const { signature, new_password, new_password_2 } = args;

			try {
				if (new_password !== new_password_2) {
					throw returnError({ message: 'nonMatchingPasswords' });
				}

				const response = await validateSignatureAndSave({ signature, new_password });

				return {
					email: response
				};
			} catch (error) {
				throw catchBlock({ message: 'serverValidateUser', error });
			}
		},

		editUser: (parent, args) => {

			return {};
		},

		deleteUser: (parent, args) => {

			return {};
		},

		followUser: async (parent, args, context) => {
			const { user_id } = context;
			const { leader_id } = args;

			try {
				await followUser({ follower_id: user_id, leader_id });

				return { user_id: leader_id };
			} catch (error) {
				throw catchBlock({ message: 'serverFollowUser', error });
			}
		}
	}
};