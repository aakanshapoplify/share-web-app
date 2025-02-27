import { gql } from "@apollo/client";

export const GET_CLUBS = gql`
  query clubBasicDetails($club_id: String!) {
    clubBasicDetails(club_id: $club_id) {
      club_id
      name
      slug
      image
      description
    }
  }
`;
export const GET_CLUBS_DETAILS = gql`
  query clubHomePageDetails($club_id: String!) {
    clubHomePageDetails(club_id: $club_id) {
      organiser {
        name
        profile_picture
      }
    }
  }
`;
