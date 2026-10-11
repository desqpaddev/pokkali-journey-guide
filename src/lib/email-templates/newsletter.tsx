import React from 'react'
import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { NEWSLETTER_ISSUES, type NewsletterIssue } from '../newsletter-issues'

const SITE = 'https://pokkali.in'

interface Props {
  issueId?: string
}

const Newsletter = ({ issueId }: Props) => {
  const issue: NewsletterIssue = NEWSLETTER_ISSUES.find((i) => i.id === issueId) ?? NEWSLETTER_ISSUES[0]
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{issue.intro}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>PAADI · POKKALI VILLAGE NEWSLETTER</Text>
            <Heading style={h1}>{issue.title}</Heading>
            <Text style={lead}>{issue.intro}</Text>
          </Section>
          {issue.posts.map((p) => (
            <Section key={p.slug} style={card}>
              <Text style={postTitle}>{p.title}</Text>
              <Text style={blurb}>{p.blurb}</Text>
              <a href={`${SITE}/blog/${p.slug}`} style={link}>Read the story →</a>
            </Section>
          ))}
          <Section style={{ textAlign: 'center', margin: '28px 0' }}>
            <Button href={`${SITE}${issue.cta.path}`} style={button}>{issue.cta.label}</Button>
          </Section>
          <Hr style={{ borderColor: '#e5e0cf' }} />
          <Text style={footer}>
            Pokkali Village · Palliyakkal, Ezhikara, Kerala · <a href={SITE} style={{ color: '#2f5c2f' }}>pokkali.in</a>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: Newsletter,
  subject: (d: Record<string, any>) =>
    (NEWSLETTER_ISSUES.find((i) => i.id === d.issueId) ?? NEWSLETTER_ISSUES[0]).subject,
  displayName: 'Newsletter',
  previewData: { issueId: NEWSLETTER_ISSUES[0].id },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, serif' }
const container = { maxWidth: '600px', margin: '0 auto', padding: '24px' }
const header = { backgroundColor: '#1f3d1f', borderRadius: '12px', padding: '28px', marginBottom: '20px' }
const brand = { color: '#e6c34a', fontSize: '11px', letterSpacing: '2px', margin: 0 }
const h1 = { color: '#ffffff', fontSize: '28px', margin: '10px 0' }
const lead = { color: '#e8efe3', fontSize: '15px', lineHeight: '1.6', margin: 0 }
const card = { border: '1px solid #e5e0cf', borderRadius: '10px', padding: '18px', marginBottom: '14px' }
const postTitle = { fontSize: '18px', fontWeight: 700, color: '#1f3d1f', margin: '0 0 6px' }
const blurb = { fontSize: '14px', color: '#4a4a4a', lineHeight: '1.5', margin: '0 0 10px' }
const link = { color: '#2f5c2f', fontWeight: 600, fontSize: '14px' }
const button = { backgroundColor: '#e6c34a', color: '#1f3d1f', padding: '12px 24px', borderRadius: '999px', fontWeight: 700, fontSize: '15px' }
const footer = { fontSize: '12px', color: '#888', textAlign: 'center' as const }
