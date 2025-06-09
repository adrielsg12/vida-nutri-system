
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface AccountConfirmationEmailProps {
  userName: string
  loginUrl: string
}

export const AccountConfirmationEmail = ({
  userName,
  loginUrl,
}: AccountConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Bem-vindo ao NutriSync! Sua conta está quase pronta.</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Heading style={logo}>NutriSync</Heading>
          <Text style={tagline}>Sistema completo de gestão para nutricionistas</Text>
        </Section>

        {/* Main Content */}
        <Section style={content}>
          <Text style={greeting}>Olá, {userName}! 👋</Text>
          
          <Text style={paragraph}>
            Seja muito bem-vindo ao <strong>NutriSync</strong>, o sistema completo de gestão para nutricionistas.
          </Text>

          <Text style={paragraph}>
            Sua conta foi criada com sucesso, e agora está <strong>aguardando aprovação da equipe de suporte</strong> para que você possa começar a usar o sistema.
          </Text>

          <Section style={timelineBox}>
            <Text style={timelineText}>
              🕒 O processo de liberação geralmente leva até 24h úteis.
            </Text>
            <Text style={timelineText}>
              Assim que sua conta for ativada, você receberá um novo e-mail confirmando o acesso.
            </Text>
          </Section>

          <Button style={button} href={loginUrl}>
            Acessar o NutriSync
          </Button>

          <Hr style={hr} />

          <Text style={supportText}>
            Se você tiver qualquer dúvida, estamos à disposição:
          </Text>
          <Text style={contactInfo}>
            📩 suporte@nutrisync.com
          </Text>

          <Text style={signature}>
            Atenciosamente,<br />
            Equipe NutriSync 💚
          </Text>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            Sistema desenvolvido pela{' '}
            <span style={footerBold}>Brainstorm Agência de Marketing</span>
            {' '}- Contato: (32) 9 9166-5327
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default AccountConfirmationEmail

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const header = {
  padding: '32px 24px 0',
  textAlign: 'center' as const,
  backgroundColor: '#10b981',
  borderRadius: '8px 8px 0 0',
}

const logo = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 8px',
  letterSpacing: '-1px',
}

const tagline = {
  color: '#ffffff',
  fontSize: '14px',
  margin: '0 0 24px',
  opacity: 0.9,
}

const content = {
  padding: '32px 24px',
}

const greeting = {
  color: '#374151',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 16px',
}

const paragraph = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 16px',
}

const timelineBox = {
  backgroundColor: '#f0fdf4',
  borderLeft: '4px solid #10b981',
  padding: '16px 20px',
  margin: '24px 0',
  borderRadius: '0 6px 6px 0',
}

const timelineText = {
  color: '#065f46',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 8px',
}

const button = {
  backgroundColor: '#10b981',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 24px',
  margin: '24px 0',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
}

const supportText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0 0 8px',
}

const contactInfo = {
  color: '#374151',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0 0 24px',
}

const signature = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
}

const footer = {
  padding: '24px',
  borderTop: '1px solid #e5e7eb',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0',
}

const footerBold = {
  fontWeight: '600',
  color: '#374151',
}
