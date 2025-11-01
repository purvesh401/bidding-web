import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || SMTP_USER || 'no-reply@auction.example';

let transporter = null;

if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
  console.log('✓ Email transporter configured successfully');
  console.log(`  - Host: ${SMTP_HOST}`);
  console.log(`  - Port: ${SMTP_PORT}`);
  console.log(`  - User: ${SMTP_USER}`);
  console.log(`  - From: ${FROM_EMAIL}`);
} else {
  console.warn('Mailer not fully configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS to enable email sending.');
  console.warn(`  - SMTP_HOST: ${SMTP_HOST ? '✓' : '✗'}`);
  console.warn(`  - SMTP_USER: ${SMTP_USER ? '✓' : '✗'}`);
  console.warn(`  - SMTP_PASS: ${SMTP_PASS ? '✓' : '✗'}`);
}

export const sendEmail = async ({ to, subject, text, html }) => {
  if (!transporter) {
    console.info('⚠ Skipping email (transporter not configured):', subject, '->', to);
    return null;
  }

  console.log(`📧 Attempting to send email to: ${to}`);
  console.log(`   Subject: ${subject}`);

  const message = {
    from: FROM_EMAIL,
    to,
    subject,
    text,
    html
  };

  try {
    const info = await transporter.sendMail(message);
    console.info('✓ Email sent successfully:', info.messageId, 'to', to);
    return info;
  } catch (err) {
    console.error('✗ Error sending email to', to, ':', err.message);
    console.error('   Full error:', err);
    return null;
  }
};
