import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
if (req.method !== "POST") {
return res.status(405).send({ message: "Method not allowed" });
}

const { name, email, bundle, superPick, premiumPick, info, total } = req.body;

const adminEmail = "adischoice.mysterybundle@gmail.com";

const subject = `New Order from ${name} – Adi’s Choice Mystery Bundle`;

const orderSummary = `
<h3>Order Summary</h3>
<ul>
<li><strong>Classic Picks:</strong> ${bundle}</li>
<li><strong>Super Pick:</strong> ${superPick}</li>
<li><strong>Premium Pick:</strong> ${premiumPick}</li>
<li><strong>Total:</strong> €${total}</li>
</ul>
<p><strong>Additional Info:</strong> ${info || "None"}</p>
`;

// Mail to Seller (You)
const msgToAdmin = {
to: adminEmail,
from: "adischoice.mysterybundle@gmail.com",
subject,
html: `
<h2>New Mystery Bundle Order</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
${orderSummary}
`,
};

// Mail to Customer
const msgToCustomer = {
to: email,
from: "adischoice.mysterybundle@gmail.com",
subject: "Your Mystery Bundle from Adi’s Choice – Order Confirmation",
html: `
<div style="font-family:Arial, sans-serif; padding:20px; border:1px solid #eee; border-radius:8px;">
<h2 style="color:#b99a3d;">Thank you for your order, ${name}!</h2>
<p>Your order has been received and will be processed shortly.</p>
${orderSummary}
<p><strong>Payment Details:</strong></p>
<p>Please transfer the total amount (€${total}) to the following account:</p>
<p><strong>IBAN:</strong> LT403130010118858430<br>
<strong>Title:</strong> Your full name<br>
<strong>Bank:</strong> Adi’s Choice Bank</p>
<p>After we receive your payment, your Mystery Bundle will be shipped soon!</p>
<p style="margin-top:20px;">Warm regards,<br><strong>Adi’s Choice Team</strong></p>
</div>
`,
};

try {
await sgMail.send(msgToAdmin);
await sgMail.send(msgToCustomer);
return res.status(200).json({ success: true });
} catch (error) {
console.error("SendGrid Error:", error);
return res.status(500).json({ error: "Failed to send emails" });
}
}
