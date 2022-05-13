import { ref, set } from 'firebase/database';
import { db } from '../../../src/firebase/config';

export const SendMessage = async (currentId, friendId, message) => {
    try {
        return await set(ref(db, 'messages/' + currentId), {
            currentId: currentId,
            friendId: friendId,
            message: message
        });
    } catch (err) {
        alert(err);
    }
}

export const RecieveMessage = async (currentId, friendId, message) => {
    try {
        return await set(ref(db, 'messages/' + friendId), {
            currentId: currentId,
            friendId: friendId,
            message: message
        });
    } catch (err) {
        alert(err);
    }
}