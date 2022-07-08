export const useLogin = () => {
    return {
        createUser: ({ email, password, first_name, last_name, password2 }) => {
            return fetch('http://localhost:5000/api/user/signup', {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    email, password, first_name, last_name, password2
                })
            }).then(resp => resp.json())
                .then((data) => {
                    if (data.status !== 201) {
                        throw data;
                    }

                    console.log("USER_CREATION_SUCCESSFUL", data);
                    localStorage.setItem('token', JSON.stringify(data.token));

                    return data.user;
                })
        }
    };
};