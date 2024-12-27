import React from 'react';

const faqs = [
  {
    question: 'Como funciona o período de teste?',
    answer: 'Você tem acesso gratuito a 10 mensagens para experimentar o Almmar. Após utilizar todas as mensagens gratuitas, você pode escolher um de nossos planos para continuar conversando.'
  },
  {
    question: 'Posso cancelar a qualquer momento?',
    answer: 'Sim, você pode cancelar sua assinatura a qualquer momento sem multa ou taxas adicionais.'
  },
  {
    question: 'As conversas são privadas?',
    answer: 'Absolutamente! Sua privacidade é nossa prioridade. Todas as conversas são criptografadas e totalmente confidenciais.'
  },
  {
    question: 'Qual a diferença entre os planos?',
    answer: 'O plano anual inclui recursos exclusivos como conversa por voz e um desconto significativo. O plano mensal oferece todas as funcionalidades básicas necessárias.'
  },
  {
    question: 'Como posso obter suporte?',
    answer: 'Oferecemos suporte via chat 24/7 para todos os planos, com prioridade para assinantes do plano anual.'
  }
];

export function FAQ() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 font-display">Perguntas Frequentes</h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <details key={index} className="bg-white rounded-lg shadow-sm p-6">
              <summary className="font-semibold cursor-pointer">{faq.question}</summary>
              <p className="mt-4 text-gray-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}