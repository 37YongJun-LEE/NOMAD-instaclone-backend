import { gql } from "apollo-server";

export default gql`
    type User {
        id: Int!
        firstName: String!
        lastName: String
        username: String!
        email: String!
        createdAt: String!
        updatedAt: String! 
        bio: String
        avatar: String  
        photos: [Photo]
        following: [User]
        followers: [User]
        totalFollowing: Int!
        totalFollowers: Int!
        isMe: Boolean!
        isFollowing: Boolean!
    }
`;

// graphQL에서는 패스워드를 물어볼 필요가 없다고 설명한다.


// 
// 