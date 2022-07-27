import client from "../../client"

export default {
    Query: {
        seePhotoLikes: async (_, {id}) => {
            const likes = await client.like.findMany({
                where: {
                    photoId: id,
                },
                    // select와 include는 매우 다르다. 
                    // 또한 둘은 같이 사용할 수 없으므로 둘중 하나만 사용해야한다.
                select: {         
                    user: true,
                },
            });
            return likes.map((like) => like.user);
        },
    },
};