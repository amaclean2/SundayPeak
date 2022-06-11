import { gql } from "@apollo/client"

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