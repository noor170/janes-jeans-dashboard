import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY is not configured');

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const { email } = await req.json();
    if (!email) throw new Error('Email is required');

    // Derive site URL from request
    const origin = req.headers.get('origin') || req.headers.get('referer') || '';
    const siteUrl = origin ? new URL(origin).origin : 'https://denim-dash-toggle.lovable.app';

    // Use admin API to generate a recovery link
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Check if user exists in auth, if not create one
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === email);

    let actionLink: string;

    if (!existingUser) {
      // Create user with a random password, then generate recovery link
      const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        password: crypto.randomUUID(), // temporary random password
      });
      if (createErr) throw createErr;

      const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email,
        options: { redirectTo: `${siteUrl}/shop/set-password` },
      });
      if (linkErr) throw linkErr;

      // Build the redirect URL with the token hash
      const tokenHash = linkData.properties?.hashed_token;
      actionLink = `${SUPABASE_URL}/auth/v1/verify?token=${tokenHash}&type=recovery&redirect_to=${encodeURIComponent(siteUrl + '/shop/set-password')}`;
    } else {
      const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email,
        options: { redirectTo: `${siteUrl}/shop/set-password` },
      });
      if (linkErr) throw linkErr;

      const tokenHash = linkData.properties?.hashed_token;
      actionLink = `${SUPABASE_URL}/auth/v1/verify?token=${tokenHash}&type=recovery&redirect_to=${encodeURIComponent(siteUrl + '/shop/set-password')}`;
    }

    const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0; padding:0; background-color:#f3f4f6; font-family: Arial, sans-serif;">
      <div style="max-width:600px; margin:0 auto; padding:40px 20px;">
        <div style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <div style="background:#2563eb; padding:32px; text-align:center;">
            <h1 style="color:#ffffff; margin:0; font-size:24px;">🔐 Activate Your Account</h1>
          </div>
          
          <!-- Body -->
          <div style="padding:32px;">
            <p style="font-size:16px; color:#374151;">Hi there,</p>
            <p style="font-size:14px; color:#6b7280;">
              You requested to set up your account password. Click the button below to create your password and start tracking your orders.
            </p>
            
            <div style="text-align:center; margin:32px 0;">
              <a href="${actionLink}" style="display:inline-block; background:#2563eb; color:#ffffff; padding:14px 40px; border-radius:8px; text-decoration:none; font-weight:bold; font-size:16px;">
                Set My Password
              </a>
            </div>
            
            <p style="font-size:13px; color:#9ca3af; text-align:center;">
              If you didn't request this, you can safely ignore this email.
            </p>
            
            <div style="margin-top:24px; padding:16px; background:#f9fafb; border-radius:8px;">
              <p style="margin:0; font-size:13px; color:#6b7280;">
                <strong>Why activate?</strong> Once you set your password, you can log in anytime to view your order history, track shipments, and manage your account.
              </p>
            </div>
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
        from: 'Account Activation <onboarding@resend.dev>',
        to: [email],
        subject: '🔐 Set Your Password - Activate Your Account',
        html,
      }),
    });

    const resendData = await resendResponse.json();
    if (!resendResponse.ok) {
      throw new Error(`Resend error [${resendResponse.status}]: ${JSON.stringify(resendData)}`);
    }

    return new Response(JSON.stringify({ success: true, emailId: resendData.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error sending activation email:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
