// Placeholder for WhatsApp / Telegram notification integration
// TODO: Integrate with WhatsApp Business API or Telegram Bot API

exports.sendWhatsAppNotification = async (phone, message) => {
  // Integrate with WhatsApp Business API
  console.log(`[WhatsApp] To: ${phone} — ${message}`);
};

exports.sendTelegramNotification = async (chatId, message) => {
  // Integrate with Telegram Bot API
  console.log(`[Telegram] To: ${chatId} — ${message}`);
};
