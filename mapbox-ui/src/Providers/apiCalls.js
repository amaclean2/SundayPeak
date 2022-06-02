export const useLogin = () => {
    return {
        loginUser: ({ email, password }) => {
            return fetch('http://localhost:5000/api/user/login', {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    email, password
                })
            }).then(resp => resp.json())
            .then((data) => {
                return data;
            }).catch((err) => {
                throw new Error(err);
            })
        }
    };
};