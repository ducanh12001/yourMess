import { push, ref } from "firebase/database";
import { db } from "../../../src/firebase/config";

export const AddFriend = async (currentId ,friendId) => {
    try {
        return await push(child(ref(db, 'users/' + currentId), 'friendList'), {
            friendId: friendId,
        })
    }catch (err) {
        alert(err);
    }
}

export const DeleteFriend = async (currentId ,friendId) => {
    try {
        return await remove(ref(db, `users/${currentId}/friendList/${friendId}`))
    }catch (err) {
        alert(err);
    }
}