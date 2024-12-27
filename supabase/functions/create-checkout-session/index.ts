import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@13.3.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { priceId, userId, email, returnUrl } = await req.json()

    if (!priceId || !userId || !email) {
      throw new Error('Dados incompletos para criar checkout')
    }

    // Busca ou cria o cliente no Stripe
    const customers = await stripe.customers.list({
      email: email,
      limit: 1
    })

    let customerId
    if (customers.data.length > 0) {
      customerId = customers.data[0].id
    } else {
      const customer = await stripe.customers.create({
        email: email,
        metadata: { userId }
      })
      customerId = customer.id
    }

    // Cria a sessão de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price: priceId,
        quantity: 1
      }],
      success_url: returnUrl || `${req.headers.get('origin')}/payment/success`,
      cancel_url: `${req.headers.get('origin')}/payment/error`,
      metadata: { userId },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_update: {
        address: 'auto',
        name: 'auto'
      },
      locale: 'pt-BR'
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Erro no checkout:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erro interno no servidor' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})