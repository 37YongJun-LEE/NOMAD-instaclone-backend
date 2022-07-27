import client from "../../client"

export default {
    Query: {
        searchUsers: async (_, { keyword }) => 
            client.user.findMany({
                where: {
                    username: {
                        startsWith: keyword.toLowerCase(),
                    },
                },
                // 이부분에 pagination 구현 가능
            })
        
    },
};