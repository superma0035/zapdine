
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Button,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface ResetEmailProps {
  resetUrl: string
  userEmail: string
}

export const ResetEmail = ({
  resetUrl,
  userEmail,
}: ResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your ZapDine password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <div style={logo}>
            <span style={logoText}>Z</span>
          </div>
          <Heading style={h1}>Reset Your Password</Heading>
        </Section>
        
        <Section style={content}>
          <Text style={text}>
            Hello! We received a request to reset the password for your ZapDine account ({userEmail}).
          </Text>
          
          <Text style={text}>
            Click the button below to reset your password:
          </Text>
          
          <Section style={buttonContainer}>
            <Button href={resetUrl} style={button}>
              Reset Password
            </Button>
          </Section>
          
          <Text style={smallText}>
            Or copy and paste this link into your browser:
          </Text>
          <Text style={linkText}>{resetUrl}</Text>
          
          <Text style={warningText}>
            This link will expire in 1 hour for security reasons.
          </Text>
        </Section>
        
        <Section style={footer}>
          <Text style={footerText}>
            If you didn't request a password reset, you can safely ignore this email.
          </Text>
          <Text style={footerText}>
            Powered by <Link href="https://spslabs.vercel.app" style={footerLink}>SPS Labs</Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default ResetEmail

const main = {
  backgroundColor: '#fef7ed',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
}

const header = {
  textAlign: 'center' as const,
  marginBottom: '40px',
}

const logo = {
  width: '64px',
  height: '64px',
  background: 'linear-gradient(to right, #f59e0b, #ea580c)',
  borderRadius: '50%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 24px',
}

const logoText = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
}

const h1 = {
  color: '#d97706',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center' as const,
}

const content = {
  backgroundColor: '#ffffff',
  padding: '40px',
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#f59e0b',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
}

const smallText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '16px 0 8px',
}

const linkText = {
  color: '#3b82f6',
  fontSize: '12px',
  wordBreak: 'break-all' as const,
  margin: '0 0 16px',
}

const warningText = {
  color: '#dc2626',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '24px 0',
  textAlign: 'center' as const,
}

const footer = {
  textAlign: 'center' as const,
  marginTop: '32px',
  paddingTop: '32px',
  borderTop: '1px solid #e5e7eb',
}

const footerText = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '8px 0',
}

const footerLink = {
  color: '#d97706',
  textDecoration: 'none',
}
