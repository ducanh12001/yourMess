import { child, onValue, push, ref, remove, set, update } from "firebase/database";
import { db } from "../../../../src/config/firebase";

export const SendRequest = async (currentId ,friendId) => {
    try {
        return await set(ref(db, `requests/${currentId}/${friendId}`), {
            request_type: 'send'
        })
    }catch (err) {
        alert("send "+err);
    }
}

export const RecieveRequest = async (currentId ,friendId) => {
    try {
        return await set(ref(db, `requests/${friendId}/${currentId}`), {
            request_type: 'recieve'
        })
    }catch (err) {
        alert("send "+err);
    }
}

export const DeclineRequest = async (currentId, friendId) => {
    try {
        await remove(ref(db, `requests/${currentId}/${friendId}`));
        await remove(ref(db, `requests/${friendId}/${currentId}`));
    }catch (err) {
        alert("deny "+err);
    }
}

export const AcceptRequest = async (currentId, friendId) => {
    try {
        await set(ref(db, `users/${currentId}/friendList/${friendId}`), {
            isFriend: true,
        }) 
        await set(ref(db, `users/${friendId}/friendList/${currentId}`), {
            isFriend: true,
        })    
        await DeclineRequest(currentId, friendId);
        
    }catch (err) {
        alert(err);
    }
}

export const DeleteFriend = async (currentId ,friendId) => {
    try {
        await remove(ref(db, `users/${currentId}/friendList/${friendId}`))
        await remove(ref(db, `users/${friendId}/friendList/${currentId}`))
    }catch (err) {
        alert(err);
    }
}