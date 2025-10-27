// api/send-confirmation.js
import sgMail from "@sendgrid/mail";

const ADMIN_EMAIL = "adischoice.mysterybundle@gmail.com";
const FROM_EMAIL = process.env.FROM_EMAIL || ADMIN_EMAIL;

export default async function handler(req, res) {
if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" });
}

try {
const { name, email, bundle, superPick, premiumPick, info, total, phone, address, delivery, payment } = req.body || {};

if (!name || !email) {
return res.status(400).json({ error: "Missing required fields: name or email" });
}

if (!process.env.SENDGRID_API_KEY) {
console.error("Missing SENDGRID_API_KEY");
return res.status(500).json({ error: "Server misconfiguration: missing SENDGRID_API_KEY" });
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const orderSummaryHtml = `
<ul>
<li><strong>Classic Picks:</strong> ${bundle || "None"}</li>
<li><strong>Super Pick:</strong> ${superPick || "None"}</li>
<li><strong>Premium Pick:</strong> ${premiumPick || "None"}</li>
<li><strong>Total:</strong> €${(total || "0.00")}</li>
<li><strong>Delivery:</strong> ${delivery || "—"}</li>
<li><strong>Payment:</strong> ${payment || "—"}</li>
</ul>
<p><strong>Additional info:</strong> ${info || "—"}</p>
<p><strong>Phone:</strong> ${phone || "—"}</p>
<p><strong>Address:</strong> ${address || "—"}</p>
`;

const msgToAdmin = {
to: ADMIN_EMAIL,
from: FROM_EMAIL,
subject: `New Order from ${name} – Adi’s Choice`,
html: `<h2>New order</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p>${orderSummaryHtml}`,
};

const msgToCustomer = {
to: email,
from: FROM_EMAIL,
subject: "Your Mystery Bundle from Adi’s Choice – Order Confirmation",
html: `
<div style="font-family:Arial,Helvetica,sans-serif;color:#222">
<div style="text-align:center;margin-bottom:12px">
<img src="${process.env.SITE_URL || ''}/logo.jpeg" alt="Adi's Choice" style="max-width:140px"/>
</div>
<h2 style="color:#b8860b">Thank you for your order, ${escapeHtml(name)}!</h2>
<p>We received your order and will process it after payment is confirmed.</p>
<h4>Order details</h4>
${orderSummaryHtml}
<div style="background:#fff8dc;padding:10px;border-radius:6px;margin-top:12px">
<p><strong>Bank account (IBAN):</strong><br/>LT403130010118858430</p>
<p>Please include your full name in the transfer title.</p>
</div>
<p>Best regards,<br/>Adi’s Choice Team</p>
</div>
`,
};

// send emails
await sgMail.send(msgToAdmin);
await sgMail.send(msgToCustomer);

return res.status(200).json({ success: true });
} catch (err) {
console.error("send-confirmation error:", err && err.response ? err.response.body : err);
const errorMsg = (err && err.response && err.response.body) ? JSON.stringify(err.response.body) : String(err.message || err);
return res.status(500).json({ error: "send_failed", details: errorMsg });
}
}

function escapeHtml(str = "") {
return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}
	

