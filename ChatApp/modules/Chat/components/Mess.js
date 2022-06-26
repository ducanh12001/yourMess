import { ref, child, push, update, serverTimestamp, set } from 'firebase/database';
import { db } from '../../../src/config/firebase';
import moment from 'moment';
import 'moment/locale/vi'
import { v4 as uuidv4 } from 'uuid';

export const SendMessage = async (currentId, friendId, message, imgUrl) => {
    const time = moment();
    time.locale('vi');
    const createTime = time.format('HH:mm');
    const createDate = time.format('DD/MM');
    const fullTime = time.format('DD/MM/YYYY HH:mm');
    const ts = serverTimestamp();
    try {
        return await push(child(ref(db, 'chats/' + currentId), friendId + "/messages"), {
            fromId: currentId,
            toId: friendId,
            message: message,
            image: imgUrl,
            createTime: createTime,
            fullTime: fullTime,
            time: ts,
            isFriendRead: false,
        }).then((res) => {
            if (message !== '' && imgUrl === '') {
                message = "Bạn: " + message;
            } else {
                message = "Bạn đã gửi 1 ảnh"
            }
            update(ref(db, `chats/${currentId}/${friendId}`), {
                lastMessage: message,
                createTime: createTime,
                createDate: createDate,
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
    const createDate = time.format('DD/MM');
    const fullTime = time.format('DD/MM/YYYY HH:mm');
    const ts = serverTimestamp();
    try {
        return await push(child(ref(db, 'chats/' + friendId), currentId + "/messages"), {
            fromId: currentId,
            toId: friendId,
            message: message,
            image: imgUrl,
            createTime: createTime,
            fullTime: fullTime,
            time: ts,
            isRead: false,
        }).then((res) => {
            if (message !== '' && imgUrl === '') {
                message = message;
            } else {
                message = "Đã nhận 1 ảnh"
            }
            update(ref(db, `chats/${friendId}/${currentId}`), {
                lastMessage: message,
                createTime: createTime,
                createDate: createDate,
                fullTime: fullTime,
                ts: ts
            })
        })
    } catch (err) {
        alert(err);
    }
}

export const SendGroupMess = async (currentId, roomId, message, imgUrl, senderImage) => {
    const time = moment();
    time.locale('vi');
    const createTime = time.format('HH:mm');
    const createDate = time.format('DD/MM');
    const fullTime = time.format('DD/MM/YYYY HH:mm');
    const ts = serverTimestamp();
    try {
        await push(child(ref(db), 'messages'), {
            roomId: roomId,
            message: message,
            imgUrl: imgUrl,
            sender: currentId,
            createTime: createTime,
            fullTime: fullTime,
            time: ts,
        }).then((res) => {
            update(ref(db, `rooms/${roomId}`), {
                lastMessage: message,
                createTime: createTime,
                createDate: createDate,
                fullTime: fullTime,
                time:ts
            })
        })
    }catch (err) {
        console.log("abc" + err);
    }
}

export const sendNoti = (heading, data, deviceId) => {
    const options = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: 'Basic MzllZjViYjYtOGE4ZC00YzBlLWJlZDMtNTVmMDY5ODdiNTBj',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            app_id: '15895846-8de2-4b50-b34e-8bb0fd918812',
            headings: { en: heading },
            contents: { en: data },
            name: data,
            include_player_ids: deviceId
        })
    };

    fetch('https://onesignal.com/api/v1/notifications', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}

