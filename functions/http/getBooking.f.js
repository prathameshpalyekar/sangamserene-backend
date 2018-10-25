// Test function
const functions = require('firebase-functions');
const firebase = require('firebase');
firebase.initializeApp({
    apiKey: "AIzaSyCiwvs6pLVSRbT2S9Sahb6cRVXZkWJq7AQ",
    authDomain: "sangamserene-india.firebaseapp.com",
    databaseURL: "https://sangamserene-india.firebaseio.com",
    projectId: "sangamserene-india",
    storageBucket: "sangamserene-india.appspot.com",
    messagingSenderId: "248823128879",
    ADMIN_EMAIL: 'sangamserene@gmail.com',
});
const moment = require('moment');
// var database = firebase.database();// const cors = require('cors')({
//   origin: true
// });

exports = module.exports = functions.https.onRequest((request, response) => {
	const { checkIn, checkOut } = request.query;
	firebase.database().ref('/booking').once('value').then((snapshot) => {
		const value = snapshot.val();
        const bookedRooms = [];
		
        if (value) {
            const bookings = Object.keys(value).map((key) => {
                const { checkIn, checkOut, reservedRooms } = value[key];
                const booking = Object.assign({}, {checkIn, checkOut, reservedRooms});
                booking.id = key;
                return booking;
            }).filter((booking) => {
                const beforeCondition = moment(checkIn).isAfter(moment(booking.checkOut));
                const afterCondition = moment(checkOut).isBefore(moment(booking.checkIn));
                // console.log(beforeCondition, afterCondition, booking.id)
                return !beforeCondition && !afterCondition;
            });

            
            bookings.forEach((booking) => {
                booking.reservedRooms.forEach((room) => {
                    console.log(room)
                    bookedRooms.push(room.room_id);
                });
            })
            console.log(bookedRooms)
        }

        firebase.database().ref('/rooms').once('value').then((snapshot) => {
			const value = snapshot.val();

			const rooms = Object.keys(value).map((key) => {
                // const room = Object.assign({}, value[key]);
                // room.id = key;
                return key;
            });
            console.log(rooms, bookedRooms)

			const availableRooms = rooms.filter((room) => !bookedRooms.some((bookedRoom) => bookedRoom === room))
			console.log(availableRooms);
			// console.log(bookedRooms)
			response.set('Access-Control-Allow-Origin', "http://localhost:6001");
		    response.set('Access-Control-Allow-Credentials', true);
		    response.set('Access-Control-Allow-Headers', 'content-type');
			response.send(availableRooms);
		})
	}).catch((err) => {
		console.log(err);
	});
});