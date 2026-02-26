// import { httpRouter } from "convex/server";
// import { httpAction } from "./_generated/server";
// import { internal } from "./_generated/api";

// const http = httpRouter();

// // Clerk webhook to sync users
// http.route({
//   path: "/clerk-users-webhook",
//   method: "POST",
//   handler: httpAction(async (ctx, request) => {
//     const payloadString = await request.text();
//     const headerPayload = request.headers;

//     try {
//       const result = await ctx.runMutation(internal.users.syncFromWebhook, {
//         payloadString,
//         svixId: headerPayload.get("svix-id") ?? "",
//         svixTimestamp: headerPayload.get("svix-timestamp") ?? "",
//         svixSignature: headerPayload.get("svix-signature") ?? "",
//       });
//       return new Response(JSON.stringify(result), {
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//       });
//     } catch (err) {
//       console.error("Webhook error:", err);
//       return new Response("Webhook Error", { status: 400 });
//     }
//   }),
// });

// export default http;

import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Webhook } from "svix";

const http = httpRouter();

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const secret = process.env.CLERK_WEBHOOK_SECRET!;

    const payload = await request.text();

    const svix_id = request.headers.get("svix-id")!;
    const svix_timestamp = request.headers.get("svix-timestamp")!;
    const svix_signature = request.headers.get("svix-signature")!;

    const wh = new Webhook(secret);

    let evt;

    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error("Webhook verification failed", err);
      return new Response("Invalid signature", { status: 400 });
    }

    await ctx.runMutation(internal.users.syncFromWebhook, {
      payloadString: JSON.stringify(evt),
      svixId: svix_id,
      svixTimestamp: svix_timestamp,
      svixSignature: svix_signature,
    });

    return new Response("OK", { status: 200 });
  }),
});

export default http;
