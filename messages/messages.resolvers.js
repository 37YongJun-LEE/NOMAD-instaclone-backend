import client from "../client";

export default {
    Room: {
        users: ({ id }) => client.room.findUnique({ where:{id} }).users(),
        messages: ({ id } /*, {cursor} 등을 추가하는거로 pagination 가능 */) => 
        client.message.findMany({
            where: {
                roomId: id,
            },
        }),

        // unread는 누가 대화방을 보고 있느냐에 따라서 달라진다는 것을 알고 있어야한다.
        unreadTotal: ({ id }, _, { loggedInUser }) => {
            if(!loggedInUser) {
                return 0;
            }
            return client.message.count({
                where: {
                    read: false,
                    roomId: id,
                    user: {
                        id: {
                            not: loggedInUser.id,
                        },
                    },
                },
            });
        } 
    },
    Message: {
        user: ({id}) => client.message.findUnique({ where: { id } }).user(),
        // 만약 메세지 삭제 기능을 만들고 싶다면 이 구간에 isMine으로 삭제가능한 유저 구분하고 삭제기능 추가 가능 
    },
};