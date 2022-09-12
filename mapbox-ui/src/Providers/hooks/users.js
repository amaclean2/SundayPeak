import { fetcher } from '../utils';
import { useUserStateContext } from '../userStateProvider';
import { useCardStateContext } from '../cardStateProvider';

export const useLoginUser = () => {
    const {
        setLoginError,
        setLoggedInUser,
        setIsLoggedIn,
        setIsLandingPage,
        formFields,
        setFormFields
    } = useUserStateContext();
    const { closeCard } = useCardStateContext();

    const loginUser = () => {

        const loginBody = {
            email: formFields.email,
            password: formFields.password
        };

        if (email && password) {
            return fetcher('/users/login', {
                method: 'POST',
                body: loginBody
            }).then(({ data }) => {
                console.log('LOGGED_IN_USER', data.user);

                localStorage.setItem('token', JSON.stringify(data.token));

                setLoggedInUser(data.user);
                setIsLoggedIn(true);
                setIsLandingPage(false);
                setFormFields({});
                setLoginError('');
                closeCard();

                return data;
            }).catch((error) => {
                console.error(error);

                let sanitizedLoginUserError = error.toString();
                sanitizedLoginUserError = sanitizedLoginUserError.replace('Error: ', '');
                setLoginError(sanitizedLoginUserError);

                return error;
            });
        } else {
            setLoginError('Email and Password fields are required. Please try again.');
        }
    };

    return {
        loginUser
    };
};

export const useSignupUser = () => {
    const {
        setLoginError,
        setLoggedInUser,
        setIsLoggedIn,
        setIsLandingPage,
        formFields
    } = useUserStateContext();
    const { closeCard } = useCardStateContext();

    const signupUser = () => {
        const {
            email,
            password,
            firstName,
            lastName,
            password2,
            legal
        } = formFields;

        console.log('FORM_FILEDS');

        if (email && password && password2 && firstName && lastName) {
            if (legal) {
                const newUserObject = {
                    email,
                    password,
                    password2,
                    first_name: firstName,
                    last_name: lastName,
                    legal
                };

                return fetcher('/users/create', {
                    method: 'POST',
                    body: newUserObject
                }).then(({ data }) => {
                    console.log('USER_CREATED', data);

                    setLoggedInUser(data.user);
                    setIsLoggedIn(true);
                    setIsLandingPage(false);
                    setFormFields({});

                    localStorage.setItem('token', data.token);
                    closeCard();

                    return data;
                }).catch((error) => {
                    console.error(error);
                    setLoginError(error.message);

                    return error;
                });
            }
        }
    }

    return {
        signupUser
    };
};

export const useGetOtherUser = () => {
    const { setWorkingUser } = useUserStateContext();

    const getOtherUser = ({ user_id }) => {
        return fetcher(`/id?id=${user_id}`).then(({ data }) => {
            setWorkingUser(data);

            return data;
        }).catch(console.error);
    };

    return { getOtherUser };
};

export const useGetLoggedInUser = () => {
    const {
        setLoggedInUser,
        setIsLoggedIn,
        setIsLandingPage
    } = useUserStateContext();

    const getLoggedInUser = () => {
        const loggedToken = localStorage.getItem('token');

        if (loggedToken) {
            return fetcher('/users/loggedIn').then(({ data }) => {
                console.log('LOGGED_IN_USER', data.user);
    
                setLoggedInUser(data.user);
                setIsLoggedIn(true);
                setIsLandingPage(false);
    
                return data;
            }).catch((error) => {
                console.error(error);
                setIsLoggedIn(false);
            });
        } else {
            setIsLoggedIn(false);
        }
        
    };

    return { getLoggedInUser };

};

export const useFollowUser = () => {
    const followUser = ({ leaderId }) => {
        return fetcher(`/users/follow?leader_id=${leaderId}`)
            .then(({ data }) => {
                console.log('FOLLOWED', data.followed);

                return data;
            }).catch(console.error);
    }

    return { followUser };
};