import bcrypt from "bcrypt";
import client from "../../client";

export default {
    Mutation: {
        createAccount: async (_, {firstName, lastName, username, email, password}
        ) => {
        try {
                           // check if username or email are already on DB.
            const existingUser = await client.user.findFirst({
                where: {
                    OR: [
                        {
                            username,
                        },
                        {
                            email,
                        },
                    ],
                },
            });
            
            //에러 처리하는 방법 (유저/비번 중복인 경우에)
            if(existingUser) {
                throw new Error("This username/password is already taken");
            }                 

            // hash password
            const uglyPassword = await bcrypt.hash(password, 10);
            await client.user.create({data: {
                username, email, firstName, lastName, password: uglyPassword,
                },
            });
            return {
                ok: true,
            };
        } catch(e) {
            return{
                ok: false,
                error: "Cant create account.",
            }
        }
            
            // save and return the user
        },

    },
};