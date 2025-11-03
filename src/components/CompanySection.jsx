import React from 'react'
import '../index.css';

function CompanySection() {
  const companies = [
    { name: 'Google', logo: 'https://logo.clearbit.com/google.com' },
    { name: 'Microsoft', logo: 'https://logo.clearbit.com/microsoft.com' },
    { name: 'Figma', logo: 'https://logo.clearbit.com/figma.com' },
    { name: 'Amazon', logo: 'https://logo.clearbit.com/amazon.com' },
  ]

  return (
    <section className="bg-white py-12">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
        Top Hiring Companies
      </h2>
      <div className="flex flex-wrap justify-center items-center gap-10">
        {companies.map((company, i) => (
          <img
            key={i}
            src={company.logo}
            alt={company.name}
            className="h-10 grayscale hover:grayscale-0 transition"
          />
        ))}
      </div>
    </section>
  )
}

export default CompanySection
