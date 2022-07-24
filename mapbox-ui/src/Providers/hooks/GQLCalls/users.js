import { useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';

import { useCardStateContext } from '../../cardStateProvider';
import { useUserStateContext } from '../../userStateProvider';
import { CREATE_USER, FOLLOW_USER, GET_OTHER_USER, GET_SIGNED_IN_USER, LOGIN_USER } from '../TypeDefs';

export const useGetUser = () => {

    // handle get a logged in user
    const [start, { data, error, loading, refetch }] = useLazyQuery(GET_SIGNED_IN_USER);

    const {
        setLoggedInUser,
        setIsLoggedIn,
        setIsLandingPage
    } = useUserStateContext();

    useEffect(() => {
        if (data) {
            console.log("LOGGED_USER", data);
            setLoggedInUser(data.getUserFromToken);
            setIsLoggedIn(true);
            setIsLandingPage(false);
        } else if (error) {
            const errorObj = error?.networkError?.result || {};

            if (errorObj?.status === 403) {
                setIsLoggedIn(false);
            }
        }
    }, [data, error]);

    const startUserAuthProcess = () => {
        const loggedToken = localStorage.getItem('token');
        if (loggedToken) {
            start();
        } else {
            setIsLoggedIn(false);
        }
    };

    return {
        startUserAuthProcess,
        refetch,
        data,
        error,
        loading
    };
};

export const useGetOtherUser = () => {
    const [start, { data, error, loading }] = useLazyQuery(GET_OTHER_USER);
    const { setWorkingUser } = useUserStateContext();

    const getOtherUser = async (id) => start({ variables: { id }});

    useEffect(() => {
        if (data?.getOtherUser) {
            setWorkingUser(data.getOtherUser);
        }
    }, [data, error, loading]);

    return {
        getOtherUser,
        data
    };
};

export const useLoginUser = () => {
    // handle logging in a user
    const [getUser, { data, error, loading }] = useLazyQuery(LOGIN_USER);
    const {
        setLoggedInUser,
        setIsLoggedIn,
        setIsLandingPage,
        setFormFields,
        setLoginError,
        formFields
    } = useUserStateContext();
    const { closeCard } = useCardStateContext();

    const attemptLogin = () => {
		const {email, password} = formFields;

		if (email && password) {
            console.log("FETCHING_USER");
			return getUser({
                variables: {
                    email,
                    password
                }
            });

		} else {
			setLoginError('Email and Password fields are required. Please try again.');
		}
	};

    useEffect(() => {
        if (data) {
            const { login: loggedInUser } = data;
            console.log("LOGGED_IN_USER", loggedInUser);

            localStorage.setItem('token', JSON.stringify(loggedInUser.token));

            setLoggedInUser(loggedInUser.user);
            setIsLoggedIn(true);
            setIsLandingPage(false);
            setFormFields({});
            setLoginError('');
            closeCard();
        }

        if (error) {
            console.log("USER_LOGIN_FAILED", error);

            let sanitizedLoginUserError = error.toString();
            sanitizedLoginUserError = sanitizedLoginUserError.replace('Error: ', '');
            setLoginError(sanitizedLoginUserError);
        }
    }, [data, error]);

    return {
        attemptLogin,
        data,
        error,
        loading
    };
};

export const useSignupUser = () => {
    // handle creating a user
    const [createUser, { data, error, loading }] = useMutation(CREATE_USER);

    const {
        formFields,
        setLoginError,
        setLoggedInUser,
        setIsLoggedIn,
        setIsLandingPage,
        setFormFields
    } = useUserStateContext();

    const { closeCard } = useCardStateContext();

    const attemptSignup = () => {
        const { email, password, firstName, lastName, password2, legal } = formFields;

        console.log("FORM_FIELDS", formFields);

        if (email && password && password2 && firstName && lastName) {
            if (legal) {
                try {
                    const newUserObj = {
                        variables: {
                            input: {
                                email,
                                password,
                                password2,
                                first_name: firstName,
                                last_name: lastName,
                                legal
                            }
                        }
                    };
    
                    createUser(newUserObj);
                } catch (error) {
                    console.log('User creation failed', error);
                    setLoginError(error.message);
                }
            } else {
                setLoginError('You must agree to the terms and conditions before creating an account.');
            }
        } else {
            console.log({ email, password, firstName, lastName, password2 });
            setLoginError('Email, Password, First Name, and Last Name fields are required. Please try again.');
        }
    };

    useEffect(() => {
        if (data) {
            console.log("USER_CREATED", data);

            const { createUser: { user: newUser }} = data;
            setLoggedInUser(newUser);
            setIsLoggedIn(true);
            setIsLandingPage(false);
            setFormFields({});
            closeCard();
        }
    }, [data, error, loading]);

    return {
        attemptSignup
    };
};

export const useFollowUser = () => {
    const [start, {data, error, loading}] = useMutation(FOLLOW_USER);

    const followUser = ({ leaderId }) => start({ variables: { leaderId }});

    return {
        followUser,
        data
    };
};