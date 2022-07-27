import { createWriteStream, write } from "fs";
import bcrypt from "bcrypt";
import client from "../../client";
import { protectedResolver } from "../users.utils";
import { uploadToS3 } from "../../shared/shared.utils";

const resolverFn =  async (
    _, 
    {firstName, lastName, username, email, password:newPassword, bio, avatar },
    { loggedInUser }
) => {
    let avatarUrl = null;
    if(avatar) {
        avatarUrl = await uploadToS3(avatar, loggedInUser.id, "avatars");
/*       const {filename, createReadStream} = await avatar;
         const newfilename = `${loggedInUser.id}-${Date.now()}-${filename}`
         // 파이프로 스트림에 연결해서 그 파일을 가져와 다른 스트림으로 연결해준다. 이를 통해서 파일을 uploads폴더에다가 업로드할 수 있다.
         // 물론 이 방식으로 서버에 파일을 저장하는 것은 매우 좋지 않다.(실무에서 않쓴다는 뜻) 
         // 따라서 추후에 데이터베이스에 저장하는 방식으로 변경될 예정?이다. ( 변경되었다. 7/21 기준, shared.utils.js 참고 )
         const readStream = createReadStream();
         const writeStream = createWriteStream(
             process.cwd() + "/uploads/" + newfilename
         );
         readStream.pipe(writeStream);
         avatarUrl = `http://localhost:4000/static/${newfilename}`;*/ 
    }
    
    let uglyPassword = null;
    if(newPassword) {
        uglyPassword = await bcrypt.hash(newPassword, 10);
    }
    const updatedUser = await client.user.update({
        where:{
            id: loggedInUser.id,
        }, 
        data:{
            firstName, 
            lastName, 
            username, 
            email, 
            bio, 
            ...(uglyPassword && { password:uglyPassword }),
            ...(avatarUrl && {avatar: avatarUrl}),
        },
    });
    if(updatedUser.id) {
        return {
            ok: true
        };
    } else {
        return {
            ok: false,
            error: "Could not update profile.",
        };
    }
};

export default {
    Mutation: {
        editProfile: protectedResolver(resolverFn),
    },
};
