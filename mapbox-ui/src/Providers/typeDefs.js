import { gql } from "@apollo/client"

export const GET_SIGNED_IN_USER = gql`
    query getUserFromToken {
        getUserFromToken {
            id
            first_name
            last_name
            email
        }
    }
`;

export const GET_ALL_ADVENTURES = gql`
    query getAllAdventures($coordinates: String!, $type: String!, $zoom: Int!) {
        getAllAdventures(coordinates: $coordinates, type: $type, zoom: $zoom) {
            id
            adventure_name
            adventure_type
            elevation
            coordinates {
                lat
                lng
            }
        }
    }
`;

export const GET_ADVENTURE = gql`
    query getAdventureDetails($id: Int!) {
        getAdventureDetails(id: $id) {
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
    mutation CreateAdventure($input: CreateAdventureInput!) {
        createAdventure(input: $input) {
            adventure_name
        }
    }
`;