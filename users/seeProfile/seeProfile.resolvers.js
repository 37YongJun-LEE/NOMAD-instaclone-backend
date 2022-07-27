import client from "../../client";

export default {
    Query: {
        SeeProfile: (_, {username}) => 
            client.user.findUnique({
                where: {
                    username,
                },
                include: {
                    following: true,
                    followers: true,
                },
            }),
    },
};