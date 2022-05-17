import { ref, set, child, push } from 'firebase/database';
import { db } from '../../../src/firebase/config';
import moment from 'moment';
import 'moment/locale/vi'

export const SendMessage = async (currentId, friendId, message, imgUrl) => {
    const time = moment();
    time.locale('vi');
    const createTime = time.format('LT');
    const createDate = time.format('L');
    try {
        return await push(child(ref(db, 'chats/' + currentId), friendId), {
            fromId: currentId,
            toId: friendId,
            message: message,
            image: imgUrl,
            createTime: createTime,
            createDate: createDate
        });
    } catch (err) {
        alert(err);
    }
}

export const RecieveMessage = async (currentId, friendId, message, imgUrl) => {
    const time = moment();
    time.locale('vi');
    const createTime = time.format('LT');
    const createDate = time.format('L');
    try {
        return await push(child(ref(db, 'chats/' + friendId), currentId), {
            fromId: currentId,
            toId: friendId,
            message: message,
            image: imgUrl,
            createTime: createTime,
            createDate: createDate
        });
    } catch (err) {
        alert(err);
    }
}