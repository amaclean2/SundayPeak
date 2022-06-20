import React from 'react';
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    HttpLink,
    from,
    ApolloLink
} from "@apollo/client";
import { onError } from '@apollo/client/link/error';

const errorLink = onError(({ graphqlErrors, networkErrors }) => {
    if (graphqlErrors) {
        graphqlErrors.forEach(({ message, location, path}) => {
            console.log(`GraphQL error ${message}`);
        });
    }
});

const authLink = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem('token');

    operation.setContext({
        headers: {
            authorization: token ? `Bearer ${token}` : ''
        }
    });

    return forward(operation);
});

const link = from([
    authLink,
    errorLink,
    new HttpLink({ uri: "http://localhost:5000/graphql" })
]);

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link,

});

export const GQLProvider = ({ children }) => (
    <ApolloProvider client={client}>
        { children }
    </ApolloProvider>
);