import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')

  if (!signature || !webhookSecret) {
    return new Response('Webhook secret not configured', { status: 400 })
  }

  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const userId = subscription.metadata.userId

        const { error } = await supabase
          .from('profiles')
          .update({
            current_plan: subscription.plan.nickname || 'premium',
            plan_status: subscription.status
          })
          .eq('id', userId)

        if (error) throw error
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const userId = subscription.metadata.userId

        const { error } = await supabase
          .from('profiles')
          .update({
            current_plan: 'trial',
            plan_status: 'canceled'
          })
          .eq('id', userId)

        if (error) throw error
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    console.error('Erro no webhook:', err)
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400 }
    )
  }
})