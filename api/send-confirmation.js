import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
if (req.method !== "POST") {
return res.status(405).send({ message: "Only POST requests allowed" });
}

const { name, email, bundleType, additionalInfo } = req.body;

const msgToSeller = {
to: process.env.FROM_EMAIL,
from: process.env.FROM_EMAIL,
subject: `🛍️ New Mystery Bundle Order from ${name}`,
text: `
New order received:

Name: ${name}
Email: ${email}
Bundle: ${bundleType}
Additional info: ${additionalInfo || "N/A"}
`,
};

const msgToBuyer = {
to: email,
from: process.env.FROM_EMAIL,
subject: "Your Mystery Bundle from Adi’s Choice – Order Confirmation",
text: `
Hi ${name},

Thank you for your order!

We’re preparing your Mystery Bundle: ${bundleType}.
Please send payment to:
IBAN: LT403130010118858430
BIC/SWIFT: (add if needed)

Delivery cost will be added depending on your courier.

Best,
Adi’s Choice Team
https://adi-s-choice-mystery-bundle.vercel.app
`,
};

try {
await sendgrid.send(msgToSeller);
await sendgrid.send(msgToBuyer);
res.status(200).json({ message: "Emails sent successfully" });
} catch (error) {
console.error(error);
res.status(500).json({ error: "Something went wrong." });
}
}
