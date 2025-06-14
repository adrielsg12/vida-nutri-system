
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ConsultationEmailRequest {
  to: string;
  name: string;
  date: string; // formato DD/MM/AAAA
  time: string; // formato HH:mm
  type: string;
  value?: string;
  notes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const { to, name, date, time, type, value, notes }: ConsultationEmailRequest = await req.json();

    const html = `
      <h2>Olá, ${name}!</h2>
      <p>Sua consulta está agendada para <b>${date}</b> às <b>${time}</b>.<br/>
      Tipo: <b>${type}</b><br/>
      Valor: <b>${value ? value : "Não informado"}</b><br/>
      Observações: <b>${notes ? notes : "Nenhuma"}</b>
      <br><br>Até breve!</p>
      <p><i>NutriSync</i></p>
    `;

    const response = await resend.emails.send({
      from: "NutriSync <onboarding@resend.dev>",
      to: [to],
      subject: "Confirmação de Consulta",
      html,
    });

    console.log("Email enviado com sucesso!", response);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Erro ao enviar email de confirmação:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
