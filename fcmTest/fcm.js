/**
 * Created by jaburur on 01-11-2017.
 */
//var FCM = require('fcm-node');
var serverKey = 'AAAAGKdJ27c:APA91bGWoTzRJ7EOV8kczeXTIA3TAytTIbMXNBD000AmOFBcmfKISEMomttCDpP-U157yVqRe_P4n7RvCl8Q-zHCE9X3oD1g7NCvZY_dfkv9WPt2uIZUKI06TOK8R_BlMhyTA1_zPMds'; //put your server key here
//var fcm = new FCM(serverKey);

var apiKey = {
    "key19":"c9n-rWZzt7s:APA91bGBXxGs_fjyzyqnKEbsHK7EHs01d03an5yhhmS3XMnj6uuFXhTh3cOqc__TGktjD2qOOMSAh6YplTuVG5B_8mUTnVkpwOlp7Pv-dIcElldihFJzswyBtN0w9iFwVVCDkGGUcoPp",
    "key21":"c1rIuSJKFD8:APA91bH4ArJErIalWbhk6gUkSKX_MD2VtAMCBixymTueQSVK4Lp-rUqHtwYSBEnD5Lkc4o2Exfsv_1y4tXaUMDE-KwjmuUaWzYBpE1u3CR4DwfGHID1Yd4404WlhAjyh3izC_htH2n99"
};

var FCM = require('fcm-push');
var fcm = new FCM(serverKey);

var message = {
    //to: apiKey.key19, // required fill with device token or topics
    to: "/topics/Ticket", // required fill with device token or topics
    //collapse_key: 'your_collapse_key',
    "data": {
        "extra": "This is a Firebase Cloud Messaging Topic Message!",
        my_key: 'my value',
        my_another_key: 'my another value'
    },
    "notification": {
        "body": "This is a Firebase Cloud Messaging Topic Message!",
        "title": "FCM Message",
        "click_action": "LoginActivity",
        "key19": "c9n-rWZzt7s:APA91bGBXxGs_fjyzyqnKEbsHK7EHs01d03an5yhhmS3XMnj6uuFXhTh3cOqc__TGktjD2qOOMSAh6YplTuVG5B_8mUTnVkpwOlp7Pv-dIcElldihFJzswyBtN0w9iFwVVCDkGGUcoPp",
        "key21": "c1rIuSJKFD8:APA91bH4ArJErIalWbhk6gUkSKX_MD2VtAMCBixymTueQSVK4Lp-rUqHtwYSBEnD5Lkc4o2Exfsv_1y4tXaUMDE-KwjmuUaWzYBpE1u3CR4DwfGHID1Yd4404WlhAjyh3izC_htH2n99"
    }
};

//callback style
fcm.send(message, function(err, response){
    if (err) {
        console.log("Something has gone wrong!",err);
    } else {
        console.log("Successfully sent with response: ", response);
    }
});

//promise style
//fcm.send(message)
//    .then(function(response){
//        console.log("Successfully sent with response: ", response);
//    })
//    .catch(function(err){
//        console.log("Something has gone wrong!");
//        console.error(err);
//    })


//var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
//    to: apiKey.key21,
//    //collapse_key: 'your_collapse_key',
//
//    //notification: {
//    //    title: 'Title of your push notification',
//    //    body: 'Body of your push notification'
//    //},
//    //
//    //data: {  //you can send only notification or only data(or include both)
//    //    my_key: 'my value',
//    //    my_another_key: 'my another value'
//    //}
//
//    "data": {
//        "extra": "This is a Firebase Cloud Messaging Topic Message!",
//        my_key: 'my value',
//        my_another_key: 'my another value'
//    },
//    "notification" : {
//        "body" : "This is a Firebase Cloud Messaging Topic Message!",
//        "title" : "FCM Message",
//        "click_action":"LoginActivity",
//        "key19":"c9n-rWZzt7s:APA91bGBXxGs_fjyzyqnKEbsHK7EHs01d03an5yhhmS3XMnj6uuFXhTh3cOqc__TGktjD2qOOMSAh6YplTuVG5B_8mUTnVkpwOlp7Pv-dIcElldihFJzswyBtN0w9iFwVVCDkGGUcoPp",
//        "key21":"c1rIuSJKFD8:APA91bH4ArJErIalWbhk6gUkSKX_MD2VtAMCBixymTueQSVK4Lp-rUqHtwYSBEnD5Lkc4o2Exfsv_1y4tXaUMDE-KwjmuUaWzYBpE1u3CR4DwfGHID1Yd4404WlhAjyh3izC_htH2n99"
//    }
//};
//
//fcm.send(message, function(err, response){
//    if (err) {
//        console.log("Something has gone wrong!");
//    } else {
//        console.log("Successfully sent with response: ", response);
//    }
//});