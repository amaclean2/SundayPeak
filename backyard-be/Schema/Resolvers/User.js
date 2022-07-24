const { comparePassword, hashPassword } = require('../../Crypto');
const { addUser: addUserDB, followUser } = require('../../DB');
const { catchBlock, returnError } = require('../../ErrorHandling');
const { buildUserObject } = require('../../Handlers/Users');
const Users = require('../../SampleData/UserData.json');
const authService = require('../../Services/auth.service');
const { sendEmail, validateSignatureAndSave } = require('../../Services/resetPassword.service');

const userResolvers = {
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

				const createdUser = await addUserDB(newUser);
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
			const {
				id,
				first_name,
				last_name,
				email,
				is_premium,
				sex,
				user_site,
				password,
				city,
				bio,
				date_created,
				last_updated
			} = args;
			const editableUserIdx = Users.findIndex((user) => user.id === id);

			const newUserData = {
				...Users[editableUserIdx],
				first_name,
				last_name,
				email,
				is_premium,
				sex,
				user_site,
				date_created,
				last_updated,
				password,
				city,
				bio
			};

			Users = [...Users.slice(0, editableUserIdx), newUserData, ...Users.slice(editableUserIdx + 1)];

			return newUserData;
		},

		deleteUser: (parent, args) => {
			const { id } = args;
			const userIdx = Users.findIndex((user) => user.id === id);

			const selectedUser = Users[userIdx];

			Users = [...Users.slice(0, userIdx), ...Users.slice(userIdx + 1)];

			return selectedUser;
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

module.exports = {
	userResolvers
};