import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";

// Send OTP verification email
export const sendOTP = internalAction({
  args: {
    email: v.string(),
    code: v.string(),
  },
  handler: async (_, args) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "KRYPTIC <noreply@krypticlab.com>",
      to: args.email,
      subject: "Your KRYPTIC Verification Code",
      html: `
        <div style="font-family: 'Helvetica', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 28px; font-weight: bold; color: #fff; letter-spacing: 4px; margin: 0;">KRYPTIC</h1>
            <p style="color: #94a3b8; margin-top: 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Streetwear Lab</p>
          </div>
          <div style="background: #1e293b; border-radius: 8px; padding: 30px; text-align: center; border: 1px solid #334155;">
            <p style="color: #cbd5e1; margin-bottom: 20px; font-size: 16px;">Your verification code is:</p>
            <div style="background: #0f172a; border: 2px solid #10b981; border-radius: 8px; padding: 20px; display: inline-block;">
              <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #10b981; font-family: monospace;">${args.code}</span>
            </div>
            <p style="color: #64748b; margin-top: 20px; font-size: 13px;">This code expires in 10 minutes.</p>
          </div>
          <p style="color: #475569; text-align: center; margin-top: 24px; font-size: 12px;">
            If you didn't request this code, you can safely ignore this email.
          </p>
        </div>
      `,
    });
  },
});

// Send admin notification for new order
export const sendOrderNotification = internalAction({
  args: {
    orderId: v.string(),
    customerEmail: v.string(),
    customerName: v.string(),
    total: v.number(),
    itemCount: v.number(),
  },
  handler: async (_, args) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const adminEmail = process.env.ADMIN_EMAIL || "admin@kryptic.com";

    const formattedTotal = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(args.total);

    await resend.emails.send({
      from: "KRYPTIC Orders <noreply@krypticlab.com>",
      to: adminEmail,
      subject: `🛒 New Order - ${formattedTotal} from ${args.customerName}`,
      html: `
        <div style="font-family: 'Helvetica', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 28px; font-weight: bold; color: #fff; letter-spacing: 4px; margin: 0;">KRYPTIC</h1>
            <p style="color: #10b981; margin-top: 4px; font-size: 14px; font-weight: 600;">New Order Received!</p>
          </div>
          <div style="background: #1e293b; border-radius: 8px; padding: 24px; border: 1px solid #334155;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; color: #94a3b8; border-bottom: 1px solid #334155;">Order ID</td>
                <td style="padding: 12px 0; color: #fff; text-align: right; font-family: monospace; border-bottom: 1px solid #334155;">${args.orderId.substring(0, 12)}...</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #94a3b8; border-bottom: 1px solid #334155;">Customer</td>
                <td style="padding: 12px 0; color: #fff; text-align: right; border-bottom: 1px solid #334155;">${args.customerName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #94a3b8; border-bottom: 1px solid #334155;">Email</td>
                <td style="padding: 12px 0; color: #fff; text-align: right; border-bottom: 1px solid #334155;">${args.customerEmail}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #94a3b8; border-bottom: 1px solid #334155;">Items</td>
                <td style="padding: 12px 0; color: #fff; text-align: right; border-bottom: 1px solid #334155;">${args.itemCount} item(s)</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #94a3b8;">Total</td>
                <td style="padding: 12px 0; color: #10b981; text-align: right; font-size: 20px; font-weight: bold;">${formattedTotal}</td>
              </tr>
            </table>
          </div>
          <div style="text-align: center; margin-top: 24px;">
            <p style="color: #64748b; font-size: 13px;">View this order in your admin dashboard.</p>
          </div>
        </div>
      `,
    });
  },
});

// Send order confirmation to customer
export const sendOrderConfirmation = internalAction({
  args: {
    orderId: v.string(),
    customerEmail: v.string(),
    customerName: v.string(),
    total: v.number(),
    orderUrl: v.string(),
  },
  handler: async (_, args) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const formattedTotal = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(args.total);

    await resend.emails.send({
      from: "KRYPTIC <noreply@krypticlab.com>",
      to: args.customerEmail,
      subject: `Order Confirmed - #${args.orderId.substring(0, 8).toUpperCase()}`,
      html: `
        <div style="font-family: 'Helvetica', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 28px; font-weight: bold; color: #fff; letter-spacing: 4px; margin: 0;">KRYPTIC</h1>
            <p style="color: #10b981; margin-top: 4px; font-size: 14px; font-weight: 600;">Order Confirmed</p>
          </div>
          <div style="background: #1e293b; border-radius: 8px; padding: 30px; border: 1px solid #334155;">
            <p style="color: #fff; font-size: 18px; margin-bottom: 20px;">Hi ${args.customerName},</p>
            <p style="color: #cbd5e1; margin-bottom: 24px; line-height: 1.6;">
              Thank you for your order! We've received it and are getting it ready. You'll receive another email when it ships.
            </p>
            
            <div style="background: #0f172a; padding: 20px; border-radius: 8px; border: 1px solid #334155; margin-bottom: 24px;">
               <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #94a3b8;">Order ID</span>
                  <span style="color: #fff; font-family: monospace;">#${args.orderId.substring(0, 8).toUpperCase()}</span>
               </div>
               <div style="display: flex; justify-content: space-between;">
                  <span style="color: #94a3b8;">Total</span>
                  <span style="color: #10b981; font-weight: bold;">${formattedTotal}</span>
               </div>
            </div>

            <div style="text-align: center;">
              <a href="${args.orderUrl}" style="display: inline-block; background: #10b981; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 14px;">View In Your Account</a>
            </div>
          </div>
          <p style="color: #64748b; text-align: center; margin-top: 24px; font-size: 12px;">
            Questions? Reply to this email or contact support.
          </p>
        </div>
      `,
    });
  },
});
