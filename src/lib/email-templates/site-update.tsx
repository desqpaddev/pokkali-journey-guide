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
  siteName?: string
  siteUrl?: string
  date?: string
}

const Group = ({ title, items }: { title: string; items: string[] }) => (
  <Section style={{ marginBottom: '22px' }}>
    <Text style={groupTitle}>{title}</Text>
    {items.map((item) => (
      <Text key={item} style={item_}>
        <span style={{ color: '#c9a227', marginRight: '8px' }}>✦</span>
        {item}
      </Text>
    ))}
  </Section>
)

const SiteUpdate = ({
  siteName = 'PAADI Tales — Pokkali Village',
  siteUrl = 'https://pokkali.in',
  date = '28 September 2026',
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>What's new on {siteName} — full changelog of everything we've built</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={brand}>PAADI · POKKALI VILLAGE</Text>
          <Heading style={h1}>Site update — what we've built 🌾</Heading>
          <Text style={subhead}>
            Here's a summary of every change made to{' '}
            <a href={siteUrl} style={{ color: '#2f5c2f', fontWeight: 600 }}>{siteUrl}</a>{' '}
            as of {date}.
          </Text>
        </Section>

        <Group
          title="PUBLIC WEBSITE — PAGES & DESIGN"
          items={[
            'Full PAADI Tales redesign: deep forest green & golden yellow theme, new fonts, elegant layouts across the site.',
            'Home page: unique 3-slide hero slider with slow zoom effect, parallax fields section, 3D tilt agriculture card, "Private Suite" flight-window tour selector with take-off animation, interactive 3D tour globe, and a creative footer illustration.',
            'Golden rice-strand mouse cursor with a glowing particle trail.',
            'New pages with rich, elegant content: Farm Tours, Products, Village Hub, Water Sports, Pokkali Story, About, Visit (map) and Contact.',
            'Your real Palliyakkal photos placed across the site — hero slider, farm tours, story, village hub and water sports.',
            'Mobile-first design: bottom navigation bar like a native app, safe-area spacing, responsive everything.',
          ]}
        />

        <Group
          title="TOURS & BOOKING"
          items={[
            'Half-day "PSCB PAADI — Pokkali Farm Tour" package added with a full 15-step itinerary from your Excel sheet.',
            'Online booking flow with automatic branded HTML booking-confirmation email.',
            '"My Bookings" area for travellers, showing their upcoming tours.',
            'Live tour experience: GPS-triggered audio stories at each stop, auto-play with pause/play controls, and QR-code scanning (back camera) for traditional equipment — each product has a bilingual English/Malayalam story.',
            'Text-to-speech narration via /api/tts for stories without uploaded audio, plus direct audio-file uploads.',
          ]}
        />

        <Group
          title="BLOG & NEWSLETTER"
          items={[
            'Blog section with listing and detail pages, seeded with stories from the Pokkali marketing site.',
            'Blog cover-photo uploads from the admin panel (no more URL-only field).',
            'Newsletter signup in the footer with subscriber storage.',
          ]}
        />

        <Group
          title="ADMIN DASHBOARD"
          items={[
            'Secure admin login at /admin/login, first-admin setup flow, and change-username/password screen.',
            'Manage tour packages, products (with QR codes and audio uploads), blogs and bookings.',
            'User approval system — only approved users can book a tour.',
            'PSCB Accounts module: daily statements with GST & stakeholder share split, reports with CSV export, settlements workflow (draft → reconciled → approved → paid), per-stakeholder ledger, stakeholders & share-rules setup, and a full audit trail. Sample data loaded for testing.',
          ]}
        />

        <Group
          title="ACCOUNTS, EMAIL & MESSAGING"
          items={[
            'Sign in with Google for travellers, plus email/password auth.',
            'Branded transactional email system on notify.pokkali.in: booking confirmations, unsubscribe handling and suppression list.',
            'Branded auth email templates: signup, invite, magic link, recovery, email change and reauthentication.',
          ]}
        />

        <Group
          title="MOBILE APP & DOCUMENTATION"
          items={[
            'Progressive Web App (PWA): installable on Android/iOS with icons and offline service worker.',
            'Capacitor Android app setup (in.pokkali.paadi) with build instructions in ANDROID.md.',
            'Full documentation: DOCUMENTATION.md (technical) and FEATURES.md (feature overview with a dated development timeline).',
            'API endpoints documented for a future Flutter app (packages, products, blog, TTS).',
          ]}
        />

        <Hr style={hr} />

        <Section style={noteBox}>
          <Text style={noteTitle}>STILL AWAITING FROM YOU</Text>
          <Text style={noteText}>
            • Photos IMG_7632 and IMG_7616 (not in the last upload)<br />
            • What the people in IMG_7507 are doing, before it goes on the site<br />
            • Water Sports & Village Hub prices, timings and menu rates<br />
            • Confirmation of the correct GST rate (currently set to 5% inclusive)<br />
            • Real contact email choice (top bar currently shows hello@pokkali.in)
          </Text>
        </Section>

        <Text style={paragraph}>
          Open the site anytime at{' '}
          <a href={siteUrl} style={{ color: '#2f5c2f', fontWeight: 600 }}>{siteUrl}</a>{' '}
          — questions? Just reply to this email.
        </Text>

        <Text style={footer}>
          Crafted with the farmers of Ezhikkara · Pokkali Village, Kerala
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: SiteUpdate,
  subject: '🌾 Site update — everything new on pokkali.in',
  displayName: 'Site Update / Changelog',
  previewData: {},
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, "Times New Roman", serif' }
const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
const header = { textAlign: 'center' as const, paddingBottom: '12px' }
const brand = { fontSize: '11px', letterSpacing: '3px', color: '#c9a227', margin: '0 0 12px', fontFamily: 'Arial, sans-serif' }
const h1 = { fontSize: '28px', color: '#1f3a1f', margin: '0 0 12px', lineHeight: '1.2' }
const subhead = { fontSize: '15px', color: '#5b6b5b', margin: '0', lineHeight: '1.55' }
const groupTitle = {
  fontSize: '11px', letterSpacing: '2px', color: '#ffffff', backgroundColor: '#1f3a1f',
  padding: '8px 12px', borderRadius: '6px', margin: '0 0 10px', fontFamily: 'Arial, sans-serif',
  textTransform: 'uppercase' as const,
}
const item_ = { fontSize: '13px', color: '#3d4a3d', lineHeight: '1.6', margin: '0 0 8px' }
const hr = { borderColor: '#e6e2d6', margin: '28px 0' }
const noteBox = { backgroundColor: '#fdf6e3', border: '1px solid #e8d9a0', borderRadius: '12px', padding: '16px 18px', margin: '0 0 20px' }
const noteTitle = { fontSize: '10px', letterSpacing: '2px', color: '#a07d1c', margin: '0 0 8px', fontFamily: 'Arial, sans-serif', textTransform: 'uppercase' as const }
const noteText = { fontSize: '13px', color: '#6b5d2e', lineHeight: '1.7', margin: '0' }
const paragraph = { fontSize: '14px', color: '#3d4a3d', lineHeight: '1.65', margin: '0 0 14px' }
const footer = { fontSize: '11px', color: '#8a8a7a', textAlign: 'center' as const, marginTop: '28px', fontFamily: 'Arial, sans-serif', letterSpacing: '1px' }
