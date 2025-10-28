// api/sendEmail.js
import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" });
}

try {
const { name, email, bundleType, quantity, total, notes } = req.body;

// EMAIL DO SPRZEDAWCY
await sendgrid.send({
to: "adischoice.mysterybundle@gmail.com", // Twój e-mail
from: "adischoice.mysterybundle@gmail.com",
subject: `🛍️ New Order from ${name}`,
html: `
<h2>New Mystery Bundle Order</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Bundle:</strong> ${bundleType}</p>
<p><strong>Quantity:</strong> ${quantity}</p>
<p><strong>Total:</strong> €${total}</p>
<p><strong>Notes:</strong> ${notes || "None"}</p>
`,
});

// EMAIL DO KLIENTA
await sendgrid.send({
to: email,
from: "adischoice.mysterybundle@gmail.com",
subject: "Your Mystery Bundle from Adi’s Choice – Order Confirmation",
html: `
<h2>Thank you for your order, ${name}!</h2>
<p>Your Mystery Bundle order has been received.</p>
<p><strong>Bundle:</strong> ${bundleType}</p>
<p><strong>Quantity:</strong> ${quantity}</p>
<p><strong>Total:</strong> €${total}</p>
<p><strong>Notes:</strong> ${notes || "None"}</p>
<br>
<p>Please complete your payment to the following bank account:</p>
<p><strong>IBAN:</strong> LT403130010118858430</p>
<p>After payment confirmation, your order will be shipped.</p>
<br>
<p>Thank you for choosing <strong>Adi’s Choice</strong>!</p>
<a href="https://adi-s-choice-mystery-bundle.vercel.app/thankyou" style="color:#c19a6b;">View your order</a>
`,
});

return res.status(200).json({ success: true });
} catch (error) {
console.error("Email error:", error);
return res.status(500).json({ error: "Something went wrong. Please try again." });
}
}

