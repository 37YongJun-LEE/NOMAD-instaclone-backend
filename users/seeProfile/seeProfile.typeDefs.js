import { gql } from "apollo-server";

export default gql`
    type Query {
        SeeProfile(username:String): User
    }
`;