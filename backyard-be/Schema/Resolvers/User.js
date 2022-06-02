const { UserInputError } = require('apollo-server-express');

const { validateCreateUser } = require('../../Validators/UserValidators');
const Users = require('../../SampleData/UserData.json');
const authService = require('../../Services/auth.sevice');

const userResolvers = {
	Query: {
		getOtherUser: (parent, args) => {
			const { id } = args;
			return Users.find((user) => user.id === id);
		}
	},

	Mutation: {
		editUser: (parent, args) => {
			const { id, first_name, last_name, email, password, city, bio } = args;
			const editableUserIdx = Users.findIndex((user) => user.id === id);

			const newUserData = {
				...Users[editableUserIdx],
				first_name,
				last_name,
				email,
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