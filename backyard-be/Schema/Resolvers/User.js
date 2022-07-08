const { ApolloError, UserInputError } = require('apollo-server-express');
const { comparePassword, hashPassword } = require('../../Crypto');
const { getUserById, getUser: getUserDB, addUser: addUserDB } = require('../../DB');
const { returnError } = require('../../ErrorHandling');
const Users = require('../../SampleData/UserData.json');
const authService = require('../../Services/auth.service');
const { NOT_FOUND, NOT_ACCEPTABLE, SERVER_ERROR } = require('../../statuses');

const userResolvers = {
	Query: {
		login: async (parent, args) => {
			try {
				const { email, password } = args;
				const user = await getUserDB(email);

				if (!user) {
					return returnError({ gql: true, status: NOT_FOUND, message: 'noAccountExists' });
				}

				if (comparePassword(password, user.password)) {
					delete user.password;
					const token = authService.issue({ id: user.id });

					console.log({ message: 'USER_LOGGED_IN', user, token });
					return { user, token };
				} else {
					return returnError({ gql: true, status: NOT_ACCEPTABLE, message: 'invalidPassword' });
				}
			} catch (error) {
				console.log("SERVER_ERROR_LOGIN_USER", error);
				return returnError({ gql: true, status: SERVER_ERROR, message: 'serverLoginUser', error });
			}
		},
		getOtherUser: (parent, args) => {
			const { id } = args;
			return Users.find((user) => user.id === id);
		},
		getUserFromToken: async (parent, args, context) => {
			const { user_id } = context;

			if (user_id) {
				return await getUserById(user_id);
			} else {
				throw new ApolloError('User is not logged in');
			}
		}
	},

	Mutation: {
		createUser: async (parent, args) => {
			try {
				const newUser = {
					...args?.input,
					password: hashPassword(args?.input?.password)
				};

				if (!newUser.legal) {
					return returnError({ gql: true, status: NOT_ACCEPTABLE, message: 'missingLegal' });
				}

				const createdUser = await addUserDB(newUser);
				const { id } = createdUser;
				const token = authService.issue({ id });
				delete createdUser.password;

				console.log({ message: 'USER_CREATED', createdUser, token });
				return { user: createdUser, token };
			} catch (error) {
				console.log("SERVER_ERROR_CREATE_USER", error);
				return returnError({ gql: true, status: SERVER_ERROR, message: 'serverCreateUser', error});
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
		}
	}
};

module.exports = {
	userResolvers
};