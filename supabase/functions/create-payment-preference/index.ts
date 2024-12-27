import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { MercadoPagoConfig, Preference } from 'https://esm.sh/mercadopago@2.0.8'

const MP_ACCESS_TOKEN = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN') || '';
const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { planId, userId, email } = await req.json()

    if (!planId || !userId || !email) {
      throw new Error('Dados incompletos')
    }

    const planPrice = planId.toLowerCase() === 'monthly' ? 29.99 : 99.99;
    const planTitle = planId.toLowerCase() === 'monthly' ? 'Plano Mensal' : 'Plano Anual';

    const preference = new Preference(client);
    const result = await preference.create({
      items: [{
        id: planId,
        title: planTitle,
        quantity: 1,
        unit_price: planPrice,
        currency_id: 'BRL'
      }],
      payer: {
        email,
      },
      back_urls: {
        success: `${req.headers.get('origin')}/payment/success`,
        failure: `${req.headers.get('origin')}/payment/error`,
      },
      auto_return: 'approved',
      metadata: { userId }
    });

    return new Response(
      JSON.stringify({ preferenceId: result.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Erro ao criar preferência:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erro interno no servidor' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})