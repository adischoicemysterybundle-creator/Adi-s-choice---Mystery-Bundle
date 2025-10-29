// api/sendEmail.js
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
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
additionalInfo,
bundleType,
bundlePrice
} = req.body || {};

// Basic validation
if (!name || !email || !bundleType || !bundlePrice) {
return res.status(400).json({ message: "Missing required fields (name, email, bundleType, bundlePrice)" });
}

const ownerMessage = {
to: process.env.FROM_EMAIL || "adischoice.mysterybundle@gmail.com",
from: process.env.FROM_EMAIL || "adischoice.mysterybundle@gmail.com",
subject: `🛍️ New Order from ${name}`,
html: `
<h2>New order received</h2>
<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>Phone:</strong> ${escapeHtml(phone || "—")}</p>
<p><strong>Address:</strong> ${escapeHtml(address || "—")}, ${escapeHtml(postal || "—")} ${escapeHtml(city || "—")}, ${escapeHtml(country || "—")}</p>
<p><strong>Delivery:</strong> ${escapeHtml(delivery || "—")}</p>
<p><strong>Bundle:</strong> ${escapeHtml(bundleType)} — ${escapeHtml(bundlePrice)}</p>
<p><strong>Additional info:</strong> ${escapeHtml(additionalInfo || "None")}</p>
`
};

const clientMessage = {
to: email,
from: process.env.FROM_EMAIL || "adischoice.mysterybundle@gmail.com",
subject: "Your Mystery Bundle from Adi’s Choice – Order Confirmation",
html: `
<div style="font-family:Arial,sans-serif;color:#222">
<img src="${process.env.SITE_URL || ""}/logo.jpeg" alt="Adi's Choice" style="max-width:140px;margin-bottom:12px"/>
<h2>Thank you for your order, ${escapeHtml(name)}!</h2>
<p>We received your order for <strong>${escapeHtml(bundleType)}</strong> (total: <strong>${escapeHtml(bundlePrice)}</strong>).</p>
<p><strong>Delivery:</strong> ${escapeHtml(delivery || "—")}</p>
${additionalInfo ? `<p><strong>Your note:</strong> ${escapeHtml(additionalInfo)}</p>` : ""}
<hr/>
<h4>Payment details</h4>
<p><strong>IBAN:</strong> LT403130010118858430</p>
<p>Please include your full name in the transfer title.</p>
<p>If you have any questions, reply to this email.</p>
<p>Best regards,<br/>Adi’s Choice Team</p>
</div>
`
};

// send mails
await sgMail.send(ownerMessage);
await sgMail.send(clientMessage);

return res.status(200).json({ message: "Emails sent" });
} catch (err) {
console.error("sendEmail error:", err);
// if sendgrid gives response body, include it (stringified)
const details = err && err.response && err.response.body ? err.response.body : String(err.message || err);
return res.status(500).json({ message: "Failed to send emails", details });
}
}

// simple escape to avoid injection in HTML mails
function escapeHtml(str = "") {
return String(str)
.replace(/&/g, "&amp;")
.replace(/</g, "&lt;")
.replace(/>/g, "&gt;")
.replace(/"/g, "&quot;")
.replace(/'/g, "&#39;");
}
	
