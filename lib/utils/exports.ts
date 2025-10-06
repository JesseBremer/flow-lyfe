import { FlowItem } from '../types';

// Export contact to vCard format (for iOS/Android)
export function exportToVCard(item: FlowItem): void {
  if (item.category !== 'contact') return;

  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${item.contactName || 'Unknown'}
TEL:${item.contactPhone || ''}
EMAIL:${item.contactEmail || ''}
NOTE:${item.content}
END:VCARD`;

  const blob = new Blob([vcard], { type: 'text/vcard' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${item.contactName || 'contact'}.vcf`;
  link.click();
  window.URL.revokeObjectURL(url);
}

// Export event to Google Calendar (.ics format)
export function exportToGoogleCalendar(item: FlowItem): void {
  if (item.category !== 'event' || !item.eventDate) return;

  const startDate = new Date(item.eventDate);
  const endDate = item.eventEndDate ? new Date(item.eventEndDate) : new Date(startDate.getTime() + 60 * 60 * 1000);

  // Format dates for iCal (YYYYMMDDTHHMMSS)
  const formatICalDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Flow-Lyfe//Event//EN
BEGIN:VEVENT
UID:${item.id}@flow-lyfe.app
DTSTAMP:${formatICalDate(new Date())}
DTSTART:${formatICalDate(startDate)}
DTEND:${formatICalDate(endDate)}
SUMMARY:${item.content}
DESCRIPTION:${item.content}
LOCATION:${item.eventLocation || ''}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `event-${item.id}.ics`;
  link.click();
  window.URL.revokeObjectURL(url);
}

// Generate Google Calendar URL (direct add)
export function getGoogleCalendarUrl(item: FlowItem): string {
  if (item.category !== 'event' || !item.eventDate) return '';

  const startDate = new Date(item.eventDate);
  const endDate = item.eventEndDate ? new Date(item.eventEndDate) : new Date(startDate.getTime() + 60 * 60 * 1000);

  // Format for Google Calendar URL (YYYYMMDDTHHmmss)
  const formatGoogleDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: item.content,
    dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
    details: item.content,
    location: item.eventLocation || ''
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Export to phone (generates tel: or sms: link)
export function getPhoneLink(item: FlowItem): string {
  if (item.category !== 'contact' || !item.contactPhone) return '';
  return `tel:${item.contactPhone}`;
}

export function getSMSLink(item: FlowItem): string {
  if (item.category !== 'contact' || !item.contactPhone) return '';
  return `sms:${item.contactPhone}`;
}

export function getEmailLink(item: FlowItem): string {
  if (item.category !== 'contact' || !item.contactEmail) return '';
  return `mailto:${item.contactEmail}`;
}
