import { child, push, ref, remove } from "firebase/database";
import { db } from "../../../../src/firebase/config";

export const SendRequest = async (currentId ,friendId) => {
    try {
        return await push(child(ref(db, 'users/' + currentId), 'userRequest'), {
            toId: friendId,
            isAccept: false,
        })
    }catch (err) {
        alert(err);
    }
}

export const RecieveRequest = async (currentId ,friendId) => {
    try {
        return await push(child(ref(db, 'users/' + friendId), 'friendRequest'), {
            fromId: friendId,
            isAccept: false,
        })
    }catch (err) {
        alert(err);
    }
}

export const AcceptRequest = async (currentId ,friendId, key) => {
    try {
        await push(child(ref(db, 'users/' + currentId), 'friendList'), {
            friendId: friendId,
        })
        await remove(ref(db, `users/${currentId}/friendRequest/${key}`));
        await remove(ref(db, `users/${friendId}/userRequest/${key}`));
    }catch (err) {
        alert(err);
    }
}

export const DenyRequest = async (currentId ,friendId, key) => {
    try {
        await remove(ref(db, `users/${currentId}/friendRequest/${key}`));
        await remove(ref(db, `users/${friendId}/userRequest/${key}`));
    }catch (err) {
        alert(err);
    }
}

export const DeleteFriend = async (currentId ,friendId) => {
    try {
        return await remove(ref(db, `users/${currentId}/friendList/${friendId}`));
    }catch (err) {
        alert(err);
    }
}