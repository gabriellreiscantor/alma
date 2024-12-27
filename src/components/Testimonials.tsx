import React from 'react';

const testimonials = [
  {
    name: 'Maria Silva',
    role: 'Designer',
    image: 'https://i.ibb.co/Cwcm87h/download.jpg',
    text: 'Incrível como o chatbot me ajuda a organizar meus pensamentos. É como ter um amigo sempre disponível para conversar.'
  },
  {
    name: 'Ana Costa',
    role: 'Psicóloga',
    image: 'https://i.ibb.co/n8TGb8R/images.jpg',
    text: 'Como profissional da área, recomendo para meus pacientes. A interface é intuitiva e as respostas são muito bem elaboradas.'
  },
  {
    name: 'João Santos',
    role: 'Estudante',
    image: 'https://i.ibb.co/ZTBC94J/images-1.jpg',
    text: 'Uso diariamente para desabafar e organizar meus pensamentos. Tem me ajudado muito com a ansiedade.'
  },
  {
    name: 'Pedro Oliveira',
    role: 'Empresário',
    image: 'https://i.ibb.co/fHdp3pp/images-2.jpg',
    text: 'Excelente ferramenta para momentos de reflexão. O plano anual vale muito a pena!'
  }
];

export function Testimonials() {
  return (
    <section className="py-24 px-4">
      <h2 className="text-4xl font-bold text-center mb-16 font-display">O que dizem nossos usuários</h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {testimonials.map((testimonial) => (
          <div key={testimonial.name} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold">{testimonial.name}</h3>
                <p className="text-gray-600 text-sm">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-gray-600">{testimonial.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}