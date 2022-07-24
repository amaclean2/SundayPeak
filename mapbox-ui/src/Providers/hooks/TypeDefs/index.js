import { gql } from '@apollo/client';

export const CREATE_TICK = gql`
    mutation createTick($adventureId: Int!, $public: Boolean!) {
        createTick(adventure_id: $adventureId, public: $public) {
            user_id
            adventure_id
            public
            id
        }
    }
`;

export const CREATE_ACTIVITY = gql`
    mutation createActivity($adventureId: Int!, $public: Boolean!) {
        createActivity(adventure_id: $adventureId, public: $public) {
            id
            adventure_id
            user_id
            public
        }
    }
`;

export * from './users';
export * from './adventures';