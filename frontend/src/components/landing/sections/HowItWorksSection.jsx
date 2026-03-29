import ScrollReveal from '../ui/ScrollReveal'
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
        <section id="how-it-works" className="py-24 bg-gradient-to-b from-white via-[#fff7f1] to-white relative overflow-hidden">
            {/* Background Pattern similar to Stats/Hero */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#ff5a1f]/5 blur-[100px]" />
                <div className="absolute top-1/2 right-0 h-[300px] w-[300px] rounded-full bg-[#ff5a1f]/5 blur-[80px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <ScrollReveal>
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <p className="text-sm font-bold text-[#ff5a1f] tracking-widest uppercase mb-3">Our Process</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            How It <span className="text-[#ff5a1f]">Works</span>
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Our streamlined process ensures quality at every step
                        </p>
                    </div>
                </ScrollReveal>

                <div className="relative">
                    {/* Connection Line - Simplified */}
                    <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#ff5a1f]/20 to-transparent" />

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {steps.map((step, index) => {
                            const IconComponent = step.icon
                            return (
                                <ScrollReveal key={index} delay={index * 0.1}>
                                    <div className="relative flex flex-col items-center text-center group">

                                        {/* Step Icon Circle */}
                                        <div className="w-24 h-24 bg-white rounded-2xl border border-[#ff5a1f]/10 shadow-sm flex items-center justify-center mb-6 relative z-10 group-hover:border-[#ff5a1f]/30 group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                                            <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#ff5a1f] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg border-2 border-white">
                                                {index + 1}
                                            </div>
                                            <IconComponent className="text-4xl text-[#ff5a1f] group-hover:scale-110 transition-transform duration-300" />
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#ff5a1f] transition-colors">
                                            {step.title}
                                        </h3>
                                    </div>
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
