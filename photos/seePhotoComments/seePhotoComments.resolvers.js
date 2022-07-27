import client from "../../client";

export default {
    Query: {
        seePhotoComments: (_, {id}) => 
            client.comment.findMany({      // 이 부분부터 pagination을 적용한 코드이다.
                where: {                   // client.commnet.findMany를 쓰고
                    photoId: id,
                },
                                            // 이 부분(10번라인:지금 이 빈줄)에서 skip 또는 cursor 등을 사용해서 pagination을 구현한다.
                orderBy: {
                    createdAt: "asc",      // asc로 오름차순 정렬
                },
            }),
    },
};