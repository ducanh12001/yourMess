import { ref, child, push, update, serverTimestamp } from 'firebase/database';
import { db } from '../../../src/config/firebase';
import moment from 'moment';
import 'moment/locale/vi'

export const SendMessage = async (currentId, friendId, message, imgUrl) => {
    const time = moment();
    time.locale('vi');
    const createTime = time.format('HH:mm');
    const createDate = time.format('L');
    const fullTime = time.format('LLLL');
    const ts = serverTimestamp();
    try {
        return await push(child(ref(db, 'chats/' + currentId), friendId + "/messages"), {
            fromId: currentId,
            toId: friendId,
            message: message,
            image: imgUrl,
            createTime: createTime,
            createDate: createDate,
            time: ts
        }).then((res) => {
            if (message !== '' && imgUrl === '') {
                message = "Bạn: " + message;
            } else {
                message = "Bạn đã gửi 1 ảnh"
            }
            update(ref(db, `chats/${currentId}/${friendId}`), {
              lastMessage: message,
              createTime: createTime,
              fullTime: fullTime,
              ts: ts
            })
        })
    } catch (err) {
        alert(err);
    }
}

export const RecieveMessage = async (currentId, friendId, message, imgUrl) => {
    const time = moment();
    time.locale('vi');
    const createTime = time.format('HH:mm');
    const createDate = time.format('L');
    const fullTime = time.format('LLLL');
    const ts = serverTimestamp();
    try {
        return await push(child(ref(db, 'chats/' + friendId), currentId + "/messages"), {
            fromId: currentId,
            toId: friendId,
            message: message,
            image: imgUrl,
            createTime: createTime,
            createDate: createDate,
            time: ts
        }).then((res) => {
            if (message !== '' && imgUrl === '') {
                message = message;
            } else {
                message = "đã gửi 1 ảnh"
            }
            update(ref(db, `chats/${friendId}/${currentId}`), {
                lastMessage: message,
                createTime: createTime,
                fullTime: fullTime,
                ts:ts
            })
        })
    } catch (err) {
        alert(err);
    }
}