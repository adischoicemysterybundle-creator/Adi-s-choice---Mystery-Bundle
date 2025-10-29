import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
if (req.method !== 'POST') {
return res.status(405).json({ message: 'Only POST request allowed' });
}

try {
const { name, email, bundleType, bundlePrice, additionalInfo } = req.body;

if (!name || !email) {
return res.status(400).json({ message: 'Missing required fields' });
}

// --- Mail to YOU (store owner) ---
const ownerMessage = {
to: 'adischoice.mysterybundle@gmail.com',
from: process.env.FROM_EMAIL,
subject: `🛍️ New Order from ${name}`,
html: `
<h2>New Order Received!</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Bundle:</strong> ${bundleType}</p>
<p><strong>Price:</strong> ${bundlePrice}</p>
<p><strong>Additional Info:</strong> ${additionalInfo || 'None'}</p>
<hr>
<p><strong>Payment details:</strong></p>
<p>Account: <strong>PL 17 1020 4900 0000 8702 3123 4567</strong></p>
<p>Recipient: <strong>Adi’s Choice</strong></p>
`,
};

// --- Mail to CLIENT ---
const customerMessage = {
to: email,
from: process.env.FROM_EMAIL,
subject: `Your Mystery Bundle from Adi’s Choice — Order Confirmation`,
html: `
<div style="font-family: Arial, sans-serif; background-color: #fff8f0; padding: 20px; border-radius: 10px;">
<img src="https://adis-choice-mystery-bundle.vercel.app/logo.jpeg" alt="Adi's Choice" width="150" style="margin-bottom: 15px;">
<h2>Thank you for your order, ${name}!</h2>
<p>We’ve received your order for the <strong>${bundleType}</strong> worth <strong>${bundlePrice}</strong>.</p>
<p>We’ll start preparing your Mystery Bundle soon 💛</p>
${
additionalInfo
? `<p><strong>Your note:</strong> ${additionalInfo}</p>`
: ''
}
<hr style="margin: 20px 0;">
<h3>Payment Details</h3>
<p><strong>Bank Account:</strong> PL 17 1020 4900 0000 8702 3123 4567</p>
<p><strong>Recipient:</strong> Adi’s Choice</p>
<hr style="margin: 20px 0;">
<p>If you have any questions, feel free to reply to this email.</p>
<p>With love, 💛<br><strong>Adi’s Choice Team</strong></p>
</div>
`,
};

await sgMail.send(ownerMessage);
await sgMail.send(customerMessage);

return res.status(200).json({ message: 'Emails sent successfully!' });
} catch (error) {
console.error('Error sending email:', error);

if (error.response) {
console.error('SendGrid response error:', error.response.body);
}

return res.status(500).json({
message: 'Failed to send emails.',
error: error.message,
});
}
}
