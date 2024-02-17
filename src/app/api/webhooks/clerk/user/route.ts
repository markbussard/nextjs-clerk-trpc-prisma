import { type IncomingHttpHeaders } from 'http';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { UserRole } from '@prisma/client';
import { Webhook, type WebhookRequiredHeaders } from 'svix';

import { db } from '~/server/db';

const webhookSecret = process.env.CLERK_USER_WEBHOOK_SECRET || '';

type UserEventData = {
  id: string;
  banned: boolean;
  created_at: number;
  updated_at: number;
  email_addresses: {
    email_address: string;
    id: string;
    linked_to: string[];
    object: string;
    reserved: boolean;
  }[];
  first_name: string | null;
  last_name: string | null;
  last_sign_in_at: number | null;
  primary_email_address_id: string;
};

async function handler(request: Request) {
  console.log('received event to sign user up');
  const payload = await request.json();
  const headersList = headers();
  const heads = {
    'svix-id': headersList.get('svix-id'),
    'svix-timestamp': headersList.get('svix-timestamp'),
    'svix-signature': headersList.get('svix-signature')
  };
  const wh = new Webhook(webhookSecret);
  let evt: Event | null = null;

  try {
    evt = wh.verify(
      JSON.stringify(payload),
      heads as IncomingHttpHeaders & WebhookRequiredHeaders
    ) as Event;
  } catch (err) {
    console.error((err as Error).message);
    return NextResponse.json({}, { status: 400 });
  }

  const eventType: EventType = evt.type;
  if (eventType === 'user.created' || eventType === 'user.updated') {
    const {
      id,
      first_name,
      last_name,
      email_addresses,
      primary_email_address_id
    } = evt.data as unknown as UserEventData;

    const primaryEmail = email_addresses.find(
      (email) => email.id === primary_email_address_id
    )?.email_address;

    if (!primaryEmail) {
      return NextResponse.json({}, { status: 400 });
    }

    try {
      await db.user.upsert({
        where: { authId: id as string },
        create: {
          authId: id as string,
          email: primaryEmail,
          firstName: first_name,
          lastName: last_name,
          role: UserRole.USER
        },
        update: {
          email: primaryEmail,
          firstName: first_name,
          lastName: last_name
        }
      });
    } catch (e: unknown) {
      console.error((e as Error).message);
      return NextResponse.json({}, { status: 400 });
    }

    return NextResponse.json({}, { status: 200 });
  }

  return NextResponse.json({}, { status: 200 });
}

type EventType = 'user.created' | 'user.updated' | '*';

type Event = {
  data: Record<string, string | number>;
  object: 'event';
  type: EventType;
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
