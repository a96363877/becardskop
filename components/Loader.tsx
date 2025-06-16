"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, CheckCircle, Clock, Sparkles } from "lucide-react"

interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
  submessage?: string
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = "جاري معالجة طلبك...",
  submessage = "يرجى الانتظار بينما نقوم بمعالجة بياناتك",
}) => {
  const loadingSteps = [
    { icon: Shield, text: "التحقق من البيانات", delay: 0 },
    { icon: CheckCircle, text: "مراجعة المعلومات", delay: 1 },
    { icon: Clock, text: "إعداد العروض", delay: 2 },
    { icon: Sparkles, text: "جاري الانتهاء", delay: 3 },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  }

  const modalVariants = {
    hidden: {
      scale: 0.8,
      opacity: 0,
      y: 20,
    },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.4,
      },
    },
    exit: {
      scale: 0.9,
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  }

  const stepVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.8,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/20 rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-purple-400/20 rounded-full animate-pulse delay-2000"></div>
            <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-pink-400/20 rounded-full animate-pulse delay-3000"></div>
          </div>

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative bg-white rounded-3xl p-8 md:p-10 flex flex-col items-center max-w-md mx-4 shadow-2xl border border-gray-100"
          >
            {/* Decorative Elements */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-60"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-40"></div>

            {/* Main Loading Animation */}
            <div className="relative mb-8">
              {/* Outer Ring */}
              <motion.div
                className="w-24 h-24 border-4 border-gray-200 rounded-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />

              {/* Animated Ring */}
              <motion.div
                className="absolute inset-0 w-24 h-24 border-4 border-transparent rounded-full"
                style={{
                  borderTopColor: "#146394",
                  borderRightColor: "#146394",
                }}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />

              {/* Inner Pulsing Circle */}
              <motion.div
                className="absolute inset-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Shield className="w-8 h-8 text-white" />
              </motion.div>

              {/* Floating Particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-blue-400 rounded-full"
                  style={{
                    top: "50%",
                    left: "50%",
                    transformOrigin: "0 0",
                  }}
                  animate={{
                    rotate: [0, 360],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.5,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Main Message */}
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{message}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{submessage}</p>
            </motion.div>

            {/* Progress Steps */}
            <div className="w-full space-y-3 mb-6">
              {loadingSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={index}
                    custom={index}
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <motion.div
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center"
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: index * 0.8,
                        ease: "easeInOut",
                      }}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </motion.div>
                    <span className="text-sm font-medium text-gray-700">{step.text}</span>
                    <motion.div
                      className="mr-auto"
                      animate={{
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: index * 0.8,
                        ease: "easeInOut",
                      }}
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>

            {/* Progress Bar */}
            <div className="w-full">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>التقدم</span>
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  جاري المعالجة...
                </motion.span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                  animate={{
                    width: ["0%", "100%"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </div>

            {/* Security Notice */}
            <motion.div
              className="mt-6 flex items-center gap-2 text-xs text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <Shield className="w-3 h-3" />
              <span>بياناتك محمية ومشفرة بأعلى معايير الأمان</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoadingOverlay
