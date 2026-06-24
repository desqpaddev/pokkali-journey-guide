import React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  guestName?: string
  packageTitle?: string
  tourDate?: string
  guests?: number
  bookingId?: string
  totalAmount?: string
  meetingPoint?: string
}

const BookingConfirmation = ({
  guestName = 'Traveler',
  packageTitle = 'Pokkali Village Heritage Tour',
  tourDate = 'To be confirmed',
  guests = 1,
  bookingId = '—',
  totalAmount = '—',
  meetingPoint = 'Pokkali Village, Chathanad Rd, Paravur, Kerala 683513',
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your Pokkali Village booking is confirmed — {packageTitle}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={brand}>PAADI · POKKALI VILLAGE</Text>
          <Heading style={h1}>Your journey is booked 🌾</Heading>
          <Text style={subhead}>
            Dear {guestName}, thank you for choosing to walk our fields. Here are
            your booking details.
          </Text>
        </Section>

        <Section style={card}>
          <Row label="Tour" value={packageTitle} />
          <Row label="Date" value={tourDate} />
          <Row label="Guests" value={String(guests)} />
          <Row label="Booking ID" value={bookingId} />
          <Row label="Total" value={totalAmount} />
        </Section>

        <Section style={meet}>
          <Text style={meetLabel}>MEETING POINT</Text>
          <Text style={meetValue}>{meetingPoint}</Text>
        </Section>

        <Hr style={hr} />

        <Text style={paragraph}>
          Please arrive 10 minutes before your scheduled time. Wear comfortable
          clothing and footwear suitable for paddy fields. Light refreshments
          and traditional Pokkali cuisine are included.
        </Text>
        <Text style={paragraph}>
          Questions? Reply to this email or write to{' '}
          <span style={{ color: '#2f5c2f', fontWeight: 600 }}>hello@pokkali.in</span>.
        </Text>

        <Text style={footer}>
          Crafted with the farmers of Ezhikkara · Pokkali Village, Kerala
        </Text>
      </Container>
    </Body>
  </Html>
)

const Row = ({ label, value }: { label: string; value: string }) => (
  <Section style={{ marginBottom: '10px' }}>
    <Text style={rowLabel}>{label}</Text>
    <Text style={rowValue}>{value}</Text>
  </Section>
)

export const template = {
  component: BookingConfirmation,
  subject: (d: Record<string, any>) =>
    `🌾 Booking confirmed — ${d?.packageTitle ?? 'Pokkali Village Tour'}`,
  displayName: 'Booking Confirmation',
  previewData: {
    guestName: 'Aarav',
    packageTitle: 'PSCB PAADI — Pokkali Farm Tour (Half Day)',
    tourDate: 'Saturday, 12 April 2025 · 9:00 AM',
    guests: 2,
    bookingId: 'PKL-2025-0421',
    totalAmount: '₹4,500',
    meetingPoint: 'Pokkali Village, Chathanad Rd, Paravur, Kerala 683513',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, "Times New Roman", serif' }
const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
const header = { textAlign: 'center' as const, paddingBottom: '12px' }
const brand = { fontSize: '11px', letterSpacing: '3px', color: '#c9a227', margin: '0 0 12px', fontFamily: 'Arial, sans-serif' }
const h1 = { fontSize: '30px', color: '#1f3a1f', margin: '0 0 12px', lineHeight: '1.2' }
const subhead = { fontSize: '15px', color: '#5b6b5b', margin: '0', lineHeight: '1.55' }
const card = { backgroundColor: '#f5f1e6', borderRadius: '14px', padding: '24px 22px', margin: '28px 0', borderLeft: '4px solid #c9a227' }
const rowLabel = { fontSize: '11px', letterSpacing: '1.5px', color: '#8a8a7a', margin: '0', fontFamily: 'Arial, sans-serif', textTransform: 'uppercase' as const }
const rowValue = { fontSize: '16px', color: '#1f3a1f', margin: '2px 0 0', fontWeight: 600 }
const meet = { backgroundColor: '#1f3a1f', borderRadius: '12px', padding: '18px 20px', color: '#fff' }
const meetLabel = { fontSize: '10px', letterSpacing: '2px', color: '#c9a227', margin: '0 0 6px', fontFamily: 'Arial, sans-serif' }
const meetValue = { fontSize: '14px', color: '#fff', margin: '0', lineHeight: '1.5' }
const hr = { borderColor: '#e6e2d6', margin: '28px 0' }
const paragraph = { fontSize: '14px', color: '#3d4a3d', lineHeight: '1.65', margin: '0 0 14px' }
const footer = { fontSize: '11px', color: '#8a8a7a', textAlign: 'center' as const, marginTop: '28px', fontFamily: 'Arial, sans-serif', letterSpacing: '1px' }