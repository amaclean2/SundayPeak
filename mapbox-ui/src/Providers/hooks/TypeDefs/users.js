import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    query login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            user {
                first_name
                last_name
                email
            }
            token
        }
    }
`;

export const CREATE_USER = gql`
    mutation createUser($input: CreateUserInput!) {
        createUser(input: $input) {
            user {
                first_name
                last_name
                email
            }
            token
        }
    }
`;

export const GET_SIGNED_IN_USER = gql`
    query getUserFromToken {
        getUserFromToken {
            id
            first_name
            last_name
            email
            ticks {
                user_id
                adventure_name
                adventure_type
                difficulty
                nearest_city
            }
            activityCount {
                count
            }
            followerCount {
                count
            }
            followingCount {
                count
            }
        }
    }
`;

export const GET_OTHER_USER = gql`
    query getOtherUser($id: Int!) {
        getOtherUser(id: $id) {
            first_name
            last_name
            id
            ticks {
                user_id
                adventure_name
                adventure_type
                difficulty
                nearest_city
            }
            activityCount {
                count
            }
            followerCount {
                count
            }
            followingCount {
                count
            }
        }
    }
`;

export const FOLLOW_USER = gql`
    mutation followUser($leaderId: Int!) {
        followUser(leader_id: $leaderId) {
            user_id
        }
    }
`;