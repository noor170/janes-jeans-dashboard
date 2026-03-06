import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface OrderItem {
  productName: string;
  quantity: number;
  size?: string;
  price: number;
}

interface OrderEmailRequest {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  shippingCity: string;
  paymentType: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const body: OrderEmailRequest = await req.json();
    const { customerName, customerEmail, orderNumber, items, totalAmount, shippingAddress, shippingCity, paymentType } = body;

    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.productName}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.size || '-'}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">৳${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const paymentLabel = paymentType === 'bkash' ? 'bKash' : 'Nagad';

    const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0; padding:0; background-color:#f3f4f6; font-family: Arial, sans-serif;">
      <div style="max-width:600px; margin:0 auto; padding:40px 20px;">
        <div style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <div style="background:#16a34a; padding:32px; text-align:center;">
            <h1 style="color:#ffffff; margin:0; font-size:24px;">✅ Order Confirmed!</h1>
          </div>
          
          <!-- Body -->
          <div style="padding:32px;">
            <p style="font-size:16px; color:#374151;">Hi <strong>${customerName}</strong>,</p>
            <p style="font-size:14px; color:#6b7280;">Thank you for your order! Here are your order details:</p>
            
            <div style="background:#f9fafb; border-radius:8px; padding:16px; margin:20px 0;">
              <p style="margin:0; font-size:14px; color:#6b7280;">Order Number</p>
              <p style="margin:4px 0 0; font-size:20px; font-weight:bold; color:#16a34a;">${orderNumber}</p>
            </div>
            
            <!-- Items Table -->
            <table style="width:100%; border-collapse:collapse; margin:20px 0;">
              <thead>
                <tr style="background:#f9fafb;">
                  <th style="padding:12px; text-align:left; font-size:12px; color:#6b7280; text-transform:uppercase;">Product</th>
                  <th style="padding:12px; text-align:center; font-size:12px; color:#6b7280; text-transform:uppercase;">Size</th>
                  <th style="padding:12px; text-align:center; font-size:12px; color:#6b7280; text-transform:uppercase;">Qty</th>
                  <th style="padding:12px; text-align:right; font-size:12px; color:#6b7280; text-transform:uppercase;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <!-- Total -->
            <div style="border-top:2px solid #e5e7eb; padding-top:16px; text-align:right;">
              <p style="font-size:20px; font-weight:bold; color:#111827; margin:0;">
                Total: <span style="color:#16a34a;">৳${totalAmount.toFixed(2)}</span>
              </p>
            </div>
            
            <!-- Shipping & Payment -->
            <div style="margin-top:24px; padding:16px; background:#f9fafb; border-radius:8px;">
              <p style="margin:0 0 8px; font-size:14px;"><strong>Shipping:</strong> ${shippingAddress}, ${shippingCity}</p>
              <p style="margin:0; font-size:14px;"><strong>Payment:</strong> ${paymentLabel}</p>
            </div>
            
            <p style="margin-top:24px; font-size:14px; color:#6b7280;">
              We'll notify you when your order is shipped. If you have any questions, feel free to reach out.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background:#f9fafb; padding:20px; text-align:center;">
            <p style="margin:0; font-size:12px; color:#9ca3af;">Thank you for shopping with us! 🛍️</p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Order Confirmation <onboarding@resend.dev>',
        to: [customerEmail],
        subject: `Order Confirmed - ${orderNumber}`,
        html,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      throw new Error(`Resend API error [${resendResponse.status}]: ${JSON.stringify(resendData)}`);
    }

    return new Response(JSON.stringify({ success: true, emailId: resendData.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error sending order email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
