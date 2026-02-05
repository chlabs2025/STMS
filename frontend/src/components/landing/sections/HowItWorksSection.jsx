"use client"
import ScrollReveal from '../ui/ScrollReveal'
import Card3D from '../ui/Card3D'
import {
    MdEco,
    MdPeople,
    MdHandshake,
    MdWarehouse,
    MdLocalShipping
} from 'react-icons/md'

const HowItWorksSection = () => {
    const steps = [
        {
            icon: MdEco,
            title: "Raw Imli Collection",
            description: "We procure quality raw tamarind and store it in our central godown for processing"
        },
        {
            icon: MdPeople,
            title: "Distribute to Vendors",
            description: "Raw imli is distributed to our network of trusted local freelancers and vendors for cleaning"
        },
        {
            icon: MdHandshake,
            title: "Quality Cleaning",
            description: "Vendors clean and process the tamarind, ensuring premium quality standards are met"
        },
        {
            icon: MdWarehouse,
            title: "Return to Godown",
            description: "Cleaned imli is returned to our godown, weighed, and prepared for bulk sale"
        },
        {
            icon: MdLocalShipping,
            title: "Bulk Distribution",
            description: "Premium cleaned tamarind is sold to buyers in tons, completing the supply chain"
        }
    ]

    return (
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-50">
                <div className="absolute top-20 left-10 w-72 h-72 bg-orange-100 rounded-full filter blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-50 rounded-full filter blur-3xl" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <ScrollReveal>
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
                        How It <span className="text-[#FF4D00]">Works</span>
                    </h2>
                    <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
                        Our streamlined process ensures quality at every step
                    </p>
                </ScrollReveal>

                <div className="relative">
                    {/* Connection Line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-orange-200 via-[#FF4D00] to-orange-200 transform -translate-y-1/2" />

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                        {steps.map((step, index) => {
                            const IconComponent = step.icon
                            return (
                                <ScrollReveal key={index} delay={index * 0.1}>
                                    <Card3D className="h-full">
                                        <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full min-h-[280px] group relative flex flex-col justify-between">
                                            {/* Step Number */}
                                            <div className="absolute -top-4 -right-2 w-8 h-8 bg-[#FF4D00] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                                                {index + 1}
                                            </div>
                                            <div className="w-16 h-16 bg-gradient-to-br from-[#FF4D00] to-[#ff9b54] rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0">
                                                <IconComponent className="text-3xl text-white" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800 mb-2 text-center group-hover:text-[#FF4D00] transition-colors flex-shrink-0">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm text-center leading-relaxed flex-1">
                                                {step.description}
                                            </p>
                                        </div>
                                    </Card3D>
                                </ScrollReveal>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowItWorksSection
