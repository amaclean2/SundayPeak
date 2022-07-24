import { gql } from '@apollo/client';

export const GET_ALL_ADVENTURES = gql`
    query getAllAdventures($coordinates: String!, $type: String!, $zoom: Int!) {
        getAllAdventures(coordinates: $coordinates, type: $type, zoom: $zoom) {
            adventures {
                id
                adventure_name
                adventure_type
                elevation
                coordinates {
                    lat
                    lng
                }
            }
            mapboxToken
        }
    }
`;

export const GET_ADVENTURE = gql`
    query getAdventureDetails($id: Int!) {
        getAdventureDetails(id: $id) {
            id
            adventure_name
            adventure_type
            elevation
            season
            bio
            approach_distance
            avg_angle
            max_angle
            difficulty
            gear
            gain
            nearest_city
            creator_id
        }
    }
`;

export const CREATE_ADVENTURE = gql`
    mutation createAdventure($input: CreateAdventureInput!) {
        createAdventure(input: $input) {
            adventure_name
        }
    }
`;

export const GET_TICKS_BY_ADVENTURE = gql`
    query getAllTicksByAdventure($adventureId: Int!) {
        getAllTicksByAdventure(adventure_id: $adventureId) {
            first_name
            last_name
            user_id
        }
    }
`;