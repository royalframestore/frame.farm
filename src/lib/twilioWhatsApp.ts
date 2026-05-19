import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function sendAdminWhatsApp(order: {
  order_ref: string;
  customer_name: string;
  mobile: string;
  email: string;
  product_name: string;
  quantity: number;
  total: number;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string | null;
  razorpay_payment_id: string;
  id: string;
}): Promise<void> {
  const message = `
🛍️ NEW ORDER — Frame. Farm

📦 Order ID: ${order.order_ref}
👤 Customer: ${order.customer_name}
📱 Mobile: ${order.mobile}
📧 Email: ${order.email}

🖼️ Product: ${order.product_name}
🔢 Quantity: ${order.quantity}
💰 Total Paid: ₹${order.total}

📍 Delivery Address:
${order.address_line}
${order.city}, ${order.state} - ${order.pincode}
${order.landmark ? `Landmark: ${order.landmark}` : ''}

⏰ Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
💳 Payment ID: ${order.razorpay_payment_id}
✅ Status: PAID
`.trim();

  const isTwilioPlaceholder = 
    !process.env.TWILIO_ACCOUNT_SID || 
    process.env.TWILIO_ACCOUNT_SID.includes("ACxxxxxxxx") ||
    !process.env.TWILIO_AUTH_TOKEN ||
    process.env.TWILIO_AUTH_TOKEN.includes("your-auth-token");

  if (isTwilioPlaceholder) {
    console.warn('Twilio WhatsApp credentials are placeholders. Skipping admin notification.');
    return;
  }

  try {
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM!,
      to: process.env.ADMIN_WHATSAPP_TO!,
      body: message,
    });

    // Mark order as WhatsApp-notified in Supabase
    const isSupabasePlaceholder = 
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project") ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role");

    if (!isSupabasePlaceholder) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      await supabaseAdmin
        .from('orders')
        .update({ twilio_notified: true })
        .eq('id', order.id);
    }
  } catch (error) {
    console.error('Twilio Error:', error);
  }
}
