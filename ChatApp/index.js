/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import OneSignal from 'react-native-onesignal';

//OneSignal Init Code
OneSignal.setLogLevel(6, 0);
OneSignal.setAppId("15895846-8de2-4b50-b34e-8bb0fd918812");
OneSignal.setLanguage("vi");
//END OneSignal Init Code

//Method for handling notifications received while app in foreground
OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
  //console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
  let notification = notificationReceivedEvent.getNotification();
  //console.log("notification: ", notification);
  const data = notification.additionalData
  //console.log("additionalData: ", data);
  // Complete with null means don't show a notification.
  notificationReceivedEvent.complete(notification);
});
//Method for handling notifications opened
OneSignal.setNotificationOpenedHandler(notification => {
  //console.log("OneSignal: notification opened:", notification);
});

AppRegistry.registerComponent(appName, () => App);
