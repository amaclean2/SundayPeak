import React from 'react';
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    HttpLink,
    from
} from "@apollo/client";
import { onError } from '@apollo/client/link/error';

const errorLink = onError(({ graphqlErrors, networkErrors }) => {
    if (graphqlErrors) {
        graphqlErrors.map(({ message, location, path}) => {
            console.log(`GraphQL error ${message}`);
        });
    }
})
const link = from([
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