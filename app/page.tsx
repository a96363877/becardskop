"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import InsuranceFormContainer from "@/components/home-inurance-form/InsuranceFormContainer"
import Header from "@/components/enhanced/Header"
import Footer from "@/components/Footer"
import CompanySection from "@/components/Company-section"
import EnhancedFeaturesSection from "@/components/enhanced/Feature-section"
import WhyChooseUs from "@/components/Choies-Why"
import { addData } from "@/lib/firebase"
import { Shield, Zap, Award, CheckCircle } from "lucide-react"

export default function Home() {
  const [_id] = useState(() => "id" + Math.random().toString(16).slice(2))

  useEffect(() => {
    if (!_id) return
    addData({ id: _id })
  }, [_id])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-700 via-[#146394] to-slate-700 min-h-screen text-white overflow-hidden">
        {/* Animated Background Elements */}     <div className="absolute inset-0 overflow-hidden">       {/* Gradient Orbs */}
          <motion.div
            className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
            animate={floatingAnimation}
          />
          <motion.div
            className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
            animate={{
              y: [10, -10, 10],
              transition: {
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
            }}
          />

          {/* Geometric Patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse delay-2000"></div>
            <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-purple-300 rounded-full animate-pulse delay-3000"></div>
          </div>

          {/* Decorative shapes with improved positioning */}
          <motion.img
            src="/right-shapes.png"
            alt="decorative shapes"
            className="absolute right-10 top-32 w-auto h-auto object-contain opacity-30 z-0 hidden lg:block"
            initial={{ opacity: 0, x: 100, rotate: -10 }}
            animate={{ opacity: 0.3, x: 0, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
          />
          <motion.img
            src="/left-shapes.png"
            alt="decorative shapes"
            className="absolute left-10 top-32 w-auto h-auto object-contain opacity-40 z-0 hidden lg:block"
            initial={{ opacity: 0, x: -100, rotate: 10 }}
            animate={{ opacity: 0.4, x: 0, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.7, ease: "easeOut" }}
          />
        </div>

        <div className="container mx-auto px-6 h-full flex flex-col justify-center items-center text-center relative z-10 py-32">
          <motion.div className="space-y-12 max-w-5xl" variants={containerVariants} initial="hidden" animate="visible">
            {/* Main Heading */}
            <motion.div variants={itemVariants} className="space-y-6">
              <motion.div
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Shield className="w-5 h-5 text-blue-300" />
                <span className="text-sm font-medium">مرخص من البنك المركزي السعودي</span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                قارن، أمّن، استلم وثيقتك
              </h1>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed text-blue-100 max-w-4xl mx-auto"
            >
              منصة واحدة تجمع لك أفضل عروض التأمين من أكثر من 20 شركة تأمين معتمدة
            </motion.p>

            {/* Feature Pills */}
            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mt-12">
              {[
                { icon: CheckCircle, text: "مرخص من ساما", color: "from-green-400 to-emerald-500" },
                { icon: Zap, text: "إصدار فوري", color: "from-blue-400 to-cyan-500" },
                { icon: Award, text: "أفضل الأسعار", color: "from-yellow-400 to-orange-500" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="group flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20 hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center`}
                  >
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Section */}
            <motion.div variants={itemVariants} className="pt-8">
              <motion.button
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-8 py-4 rounded-full shadow-2xl shadow-blue-500/25 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  document.querySelector("#insurance-form")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }}
              >
                <span className="text-lg">ابدأ المقارنة الآن</span>
                <motion.div
                  className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  <svg className="w-3 h-3 rotate-180" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Wave decoration */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <motion.svg
            viewBox="0 0 1440 320"
            className="w-full h-40 text-gray-50"
            preserveAspectRatio="none"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 1 }}
          >
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(249 250 251)" />
                <stop offset="100%" stopColor="rgb(243 244 246)" />
              </linearGradient>
            </defs>
            <path
              fill="url(#waveGradient)"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </motion.svg>
        </div>
      </section>

      {/* Form Section with enhanced styling */}
      <div id="insurance-form" className="relative -mt-20 z-20">
        <InsuranceFormContainer />
      </div>

      {/* Enhanced spacing between sections */}
      <div className="py-16">
        <CompanySection />
      </div>

      <div className="py-16 bg-white">
        <EnhancedFeaturesSection />
      </div>

      <div className="py-16">
        <WhyChooseUs />
      </div>

      <Footer />
    </main>
  )
}
