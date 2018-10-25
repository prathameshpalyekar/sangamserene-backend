const functions = require('firebase-functions');
const firebase = require('firebase');
const nodemailer = require('nodemailer');
const gmailEmail = 'noreply.sangamserene@gmail.com';
const gmailPassword = 'Parthk19';
const ownerEmail = 'sangamserene@gmail.com';

const mailTransport = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: gmailEmail,
		pass: gmailPassword,
	},
});

exports = module.exports = functions.https.onRequest((request, response) => {
	const data = request.body;
	const { checkIn, checkOut, reservedRooms, name, email, phoneNumber, payment, address, nonVeg, veg } = data;

	const mailOptions = {
	    from: `<noreply@firebase.com>`,
	    to: ownerEmail,
	};

	const customerMailOptions = {
		from: `<noreply@firebase.com>`,
		to: email
	}

	customerMailOptions.subject = `Booking Confirmed`;

	
	const bookedRooms = (reservedRooms || []).map((room) => room.room_name);
	let bookedRoomsString = bookedRooms.join(', ');
	
	let adults = 0;
	let children = 0;
	(reservedRooms || []).forEach((room) => {
		console.log(room)
		adults += room.booking.adults + room.booking.extras;
		children += room.booking.children;
	});

	console.log(adults, children)

	mailOptions.subject = `Booking Information!`;
	const start = `Following is the booking information:`;
	const newLine = `\n`;
	const InfocheckIn = `Check In : ${checkIn}`;
	const InfocheckOut = `Check Out : ${checkOut}`;
	const Infoname = `Name : ${name}`;
	const Infoemail = `Email : ${email}`;
	const InfophoneNumber = `Phone number : ${phoneNumber}`;
	const Infopayment = `Payment : ${payment}`;
	const InfoAddress = `Address : ${address}`;
	const InforeservedRooms = `Rooms Booked : ${bookedRoomsString}`;
	const nonVegFood = `Non-veg : ${nonVeg} persons`;
	const vegFood = `Veg : ${veg} persons`;
	const AdultsCount = `Adults : ${adults}`;
	const ChildCount = `Children : ${children}`;

	mailOptions.text = 
		start +
		newLine + 
		InfocheckIn +
		newLine + 
		InfocheckOut +
		newLine + 
		Infoname +
		newLine + 
		Infoemail + 
		newLine + 
		InfophoneNumber + 
		newLine+
		InfoAddress+
		newLine + 
		Infopayment + 
		newLine +
		InforeservedRooms +
		newLine +
		nonVegFood +
		newLine +
		vegFood +
		newLine +
		AdultsCount +
		newLine +
		ChildCount +
		newLine
		;

	customerMailOptions.text = 
		start +
		newLine + 
		InfocheckIn +
		newLine + 
		InfocheckOut +
		newLine + 
		Infoname +
		newLine + 
		Infoemail + 
		newLine + 
		InfophoneNumber + 
		newLine+
		InfoAddress+
		newLine + 
		Infopayment + 
		newLine +
		AdultsCount +
		newLine +
		ChildCount +
		newLine

		console.log(customerMailOptions.text)

		if (name && payment) {
			mailTransport.sendMail(mailOptions).then(() => {
				mailTransport.sendMail(customerMailOptions).then(() => {
					response.set('Access-Control-Allow-Origin', "http://localhost:6001");
				    response.set('Access-Control-Allow-Credentials', true);
				    response.set('Access-Control-Allow-Headers', 'content-type');
				    const someData = {
				    	success: true,
				    	data: 'Mail Sent'
				    }
					response.send(someData);
					console.log('New welcome email sent to:');
				});
			});
		} else {
			response.set('Access-Control-Allow-Origin', "http://localhost:6001");
		    response.set('Access-Control-Allow-Credentials', true);
		    response.set('Access-Control-Allow-Headers', 'content-type');
		    const someData = {
		    	success: true,
		    	data: 'Mail Sent'
		    }
			response.send(someData);
		}

	// response.send(data);
});