import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export const sendSMS = async (to: string, message: string) => {
  if (!client) {
    console.log(`SMS to ${to}: ${message}`);
    return;
  }

  try {
    await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to,
    });
    console.log(`SMS sent to ${to}`);
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
};

export const notifyProvider = async (providerPhone: string, bookingId: string) => {
  const message = `New booking assigned! Booking ID: ${bookingId}. Please check your dashboard.`;
  await sendSMS(providerPhone, message);
};

export const notifyUser = async (userPhone: string, status: string, bookingId: string) => {
  const message = `Your booking ${bookingId} status updated to: ${status}.`;
  await sendSMS(userPhone, message);
};