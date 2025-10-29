// File: /api/sendEmail.js

import sgMail from "@sendgrid/mail";

// Klucz API zdefiniowany w Vercel → Settings → Environment Variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
// ✅ Akceptuj tylko zapytania POST (z formularza)
if (req.method !== "POST") {
return res.status(405).json({ message: "Only POST requests allowed" });
}

try {
const {
name,
email,
phone,
address,
city,
postal,
country,
delivery,
notes,
bundleType,
bundleSize,
totalPrice,
} = req.body;

// ✅ Mail do Ciebie (sprzedawcy)
const sellerMessage = {
to: "adischoice.mysterybundle@gmail.com",
from: "adischoice.mysterybundle@gmail.com", // adres nadawcy z SendGrid
subject: `🛍️ New Mystery Bundle Order from ${name}`,
html: `
<h2>New order received!</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Phone:</strong> ${phone}</p>
<p><strong>Address:</strong> ${address}, ${postal} ${city}, ${country}</p>
<p><strong>Delivery:</strong> ${delivery}</p>
<p><strong>Notes:</strong> ${notes || "None"}</p>
<p><strong>Bundle:</strong> ${bundleType} - ${bundleSize}</p>
<p><strong>Total price:</strong> €${totalPrice}</p>
`,
};

// ✅ Mail do klienta (potwierdzenie)
const clientMessage = {
to: email,
from: "adischoice.mysterybundle@gmail.com",
subject: "🎁 Your Mystery Bundle from Adi’s Choice – Order Confirmation",
html: `
<h2>Thank you for your order, ${name}!</h2>
<p>We’ve received your Mystery Bundle order.</p>
<p><strong>Bundle:</strong> ${bundleType} - ${bundleSize}</p>
<p><strong>Total:</strong> €${totalPrice}</p>
<p>Bank account for payment: <strong>LT403130010118858430</strong></p>
<p>Please include your name and email in the transfer title.</p>
<p>Delivery cost will be added depending on the selected method.</p>
<p>You’ll receive a confirmation once your payment is received.</p>
<p>Thank you for choosing Adi’s Choice!</p>
`,
};

// ✅ Wysyłamy oba maile
await sgMail.send(sellerMessage);
await sgMail.send(clientMessage);

// ✅ Sukces
return res.status(200).json({ message: "Emails sent successfully" });

} catch (error) {
console.error("SendGrid Error:", error);
return res.status(500).json({ message: "Failed to send emails", error });
}
}
	
