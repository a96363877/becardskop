"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Users, CreditCard, AlertCircle, CheckCircle } from "lucide-react"
import { onlyNumbers } from "@/lib/utils"
import type { InsuranceFormData } from "@/lib/types/insurance"

interface Props {
  formData: InsuranceFormData
  setFormData: React.Dispatch<React.SetStateAction<InsuranceFormData>>
  errors: Partial<Record<keyof InsuranceFormData, string>>
}

const InsurancePurpose: React.FC<Props> = ({ formData, setFormData, errors }) => {
  // When purpose changes, reset related fields
  const handlePurposeChange = (newPurpose: "renewal" | "property-transfer") => {
    setFormData((prev: any) => ({
      ...prev,
      insurance_purpose: newPurpose,
      // Reset fields when switching purpose
      owner_identity_number: "",
      buyer_identity_number: "",
      seller_identity_number: "",
      // Force registration type when transfer is selected
      vehicle_type: newPurpose === "property-transfer" ? "registration" : prev.vehicle_type,
    }))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const purposeOptions = [
    {
      value: "renewal",
      label: "تأمين جديد",
      icon: CreditCard,
      description: "للحصول على تأمين جديد للمركبة",
      color: "from-blue-500 to-cyan-500",
    },
    {
      value: "property-transfer",
      label: "نقل ملكية",
      icon: Users,
      description: "لنقل ملكية المركبة مع التأمين",
      color: "from-purple-500 to-pink-500",
    },
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">الغرض من التأمين</h3>
        </div>
        <p className="text-gray-600 text-sm">اختر الغرض المناسب لطلب التأمين الخاص بك</p>
      </motion.div>

      <div className="space-y-8">
        {/* Purpose Selection */}
        <motion.div variants={itemVariants} className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700 mb-3">نوع الخدمة المطلوبة</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {purposeOptions.map((option) => {
              const Icon = option.icon
              const isSelected = formData.insurance_purpose === option.value

              return (
                <motion.label
                  key={option.value}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="insurance_purpose"
                    value={option.value}
                    checked={isSelected}
                    onChange={() => handlePurposeChange(option.value as "renewal" | "property-transfer")}
                    className="sr-only"
                  />
                  <div
                    className={`relative p-3 rounded-xl border-2 transition-all duration-300 ${isSelected
                        ? "border-blue-500 bg-blue-50 shadow-lg"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                      }`}
                  >
                    {/* Selection Indicator */}
                    <div className="absolute top-4 right-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"
                          }`}
                      >
                        {isSelected && <CheckCircle className="w-6 h-6 text-white" />}
                      </div>
                    </div>

                    {/* Icon */}
                    <div
                      className={`w-8 h-8 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-r ${isSelected ? option.color : "from-gray-100 to-gray-200"
                        }`}
                    >
                      <Icon className={`w-6 h-6 ${isSelected ? "text-white" : "text-gray-600"}`} />
                    </div>

                    {/* Content */}
                    <h4 className={`text-lg font-bold mb-2 ${isSelected ? "text-blue-700" : "text-gray-800"}`}>
                      {option.label}
                    </h4>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </motion.label>
              )
            })}
          </div>
        </motion.div>

        {/* Dynamic Fields */}
        <AnimatePresence mode="wait">
          <motion.div
            key={formData.insurance_purpose}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Document Owner Name */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                اسم مالك الوثيقة بالكامل
                <span className="text-red-500 mr-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.documment_owner_full_name}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      documment_owner_full_name: e.target.value,
                    }))
                  }
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${errors.documment_owner_full_name
                      ? "border-red-500 bg-red-50"
                      : formData.documment_owner_full_name
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 bg-white hover:border-gray-400"
                    }`}
                  placeholder="أدخل اسم مالك الوثيقة بالكامل"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  {errors.documment_owner_full_name ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : formData.documment_owner_full_name ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <User className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
              <AnimatePresence>
                {errors.documment_owner_full_name && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-500 text-sm flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.documment_owner_full_name}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Conditional Identity Fields */}
            {formData.insurance_purpose === "renewal" ? (
              <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  رقم الهوية الوطنية
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative">
                  <input
                    dir="rtl"

                    type="tel"
                    maxLength={10}
                    value={formData.owner_identity_number || ""}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        owner_identity_number: onlyNumbers(e.target.value),
                      }))
                    }
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${errors.owner_identity_number
                        ? "border-red-500 bg-red-50"
                        : formData.owner_identity_number && formData.owner_identity_number.length === 10
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300 bg-white hover:border-gray-400"
                      }`}
                    placeholder="أدخل رقم الهوية (10 أرقام)"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    {errors.owner_identity_number ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : formData.owner_identity_number && formData.owner_identity_number.length === 10 ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <CreditCard className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>يجب أن يكون 10 أرقام</span>
                  <span>{formData.owner_identity_number?.length || 0}/10</span>
                </div>
                <AnimatePresence>
                  {errors.owner_identity_number && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-500 text-sm flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errors.owner_identity_number}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                {/* Buyer Identity */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    رقم هوية المشتري
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      maxLength={10}
                      value={formData.buyer_identity_number || ""}
                      onChange={(e) =>
                        setFormData((prev: any) => ({
                          ...prev,
                          buyer_identity_number: onlyNumbers(e.target.value),
                        }))
                      }
                      className={`w-full px-4 py-3 pr-12 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${errors.buyer_identity_number
                          ? "border-red-500 bg-red-50"
                          : formData.buyer_identity_number && formData.buyer_identity_number.length === 10
                            ? "border-green-500 bg-green-50"
                            : "border-gray-300 bg-white hover:border-gray-400"
                        }`}
                      placeholder="أدخل رقم هوية المشتري (10 أرقام)"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      {errors.buyer_identity_number ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : formData.buyer_identity_number && formData.buyer_identity_number.length === 10 ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <CreditCard className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>يجب أن يكون 10 أرقام</span>
                    <span>{formData.buyer_identity_number?.length || 0}/10</span>
                  </div>
                  <AnimatePresence>
                    {errors.buyer_identity_number && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-500 text-sm flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.buyer_identity_number}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Seller Identity */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    رقم هوية البائع
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      maxLength={10}
                      value={formData.seller_identity_number || ""}
                      onChange={(e) =>
                        setFormData((prev: any) => ({
                          ...prev,
                          seller_identity_number: onlyNumbers(e.target.value),
                        }))
                      }
                      className={`w-full px-4 py-3 pr-12 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${errors.seller_identity_number
                          ? "border-red-500 bg-red-50"
                          : formData.seller_identity_number && formData.seller_identity_number.length === 10
                            ? "border-green-500 bg-green-50"
                            : "border-gray-300 bg-white hover:border-gray-400"
                        }`}
                      placeholder="أدخل رقم هوية البائع (10 أرقام)"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      {errors.seller_identity_number ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : formData.seller_identity_number && formData.seller_identity_number.length === 10 ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <CreditCard className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>يجب أن يكون 10 أرقام</span>
                    <span>{formData.seller_identity_number?.length || 0}/10</span>
                  </div>
                  <AnimatePresence>
                    {errors.seller_identity_number && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-500 text-sm flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.seller_identity_number}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default InsurancePurpose
