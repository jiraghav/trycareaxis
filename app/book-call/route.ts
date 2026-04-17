import { NextResponse } from 'next/server';

function buildGoogleCalendarTemplateLink() {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Care Axis Launch / Demo Call',
    details:
      'Care Axis onboarding and package call. Review quote, implementation timeline, migration, and launch milestones.',
    location: 'Google Meet',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export async function GET() {
  const bookingUrl = process.env.CARE_AXIS_GOOGLE_CALENDAR_BOOKING_URL;
  const target = bookingUrl && bookingUrl.trim().length > 0
    ? bookingUrl
    : buildGoogleCalendarTemplateLink();

  return NextResponse.redirect(target, { status: 302 });
}
