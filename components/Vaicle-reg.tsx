"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, CreditCard, Phone, Hash, Car, Truck, CheckCircle, AlertCircle } from "lucide-react"
import type { InsuranceFormData } from "@/lib/types/insurance"
import { onlyNumbers } from "@/lib/utils"

interface Props {
  formData: InsuranceFormData
  setFormData: React.Dispatch<React.SetStateAction<InsuranceFormData>>
  errors: Partial<Record<keyof InsuranceFormData, string>>
  disabled?: boolean
}

const VehicleRegistration: React.FC<Props> = ({ formData, setFormData, errors, disabled }) => {
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

  const vehicleTypeOptions = [
    {
      value: "registration",
      label: "استمارة",
      description: "للمركبات المسجلة محلياً",
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
    },
    {
      value: "customs",
      label: "بطاقة جمركية",
      description: "للمركبات المستوردة",
      icon: CreditCard,
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
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
            <Car className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">نوع تسجيل المركبة</h3>
        </div>
        <p className="text-gray-600 text-sm">اختر نوع التسجيل المناسب لمركبتك</p>
      </motion.div>

      <div className="space-y-8">
        {/* Vehicle Type Selection */}
        <motion.div variants={itemVariants} className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700 mb-3">نوع وثيقة المركبة</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicleTypeOptions.map((option) => {
              const Icon = option.icon
              const isSelected = formData.vehicle_type === option.value
              const isDisabled = disabled && option.value === "customs"

              return (
                <motion.label
                  key={option.value}
                  whileHover={!isDisabled ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!isDisabled ? { scale: 0.98 } : {}}
                  className={`cursor-pointer group ${isDisabled ? "cursor-not-allowed" : ""}`}
                >
                  <input
                    type="radio"
                    name="vehicle_type"
                    value={option.value}
                    checked={isSelected}
                    onChange={(e) => {
                      if (!isDisabled) {
                        setFormData((prev) => ({
                          ...prev,
                          vehicle_type: e.target.value as "registration" | "customs",
                        }))
                      }
                    }}
                    disabled={isDisabled}
                    className="sr-only"
                  />
                  <div
                    className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 shadow-lg"
                        : isDisabled
                          ? "border-gray-200 bg-gray-100 opacity-50"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                    }`}
                  >
                    {/* Selection Indicator */}
                    <div className="absolute top-4 right-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                          isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"
                        }`}
                      >
                        {isSelected && <CheckCircle className="w-6 h-6 text-white" />}
                      </div>
                    </div>

                    {/* Disabled Overlay */}
                    {isDisabled && (
                      <div className="absolute inset-0 bg-gray-200 bg-opacity-50 rounded-xl flex items-center justify-center">
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">غير متاح لنقل الملكية</span>
                      </div>
                    )}

                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-r ${
                        isSelected ? option.color : "from-gray-100 to-gray-200"
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
            key={formData.vehicle_type}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {formData.vehicle_type === "registration" ? (
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                {/* Phone Number */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    رقم الهاتف
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                    dir="rtl"

                      type="tel"
                      maxLength={10}
                      value={formData.phone || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: onlyNumbers(e.target.value),
                        }))
                      }
                      className={`w-full px-4 py-3 pr-12 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                        errors.phone
                          ? "border-red-500 bg-red-50"
                          : formData.phone && formData.phone.length === 10
                            ? "border-green-500 bg-green-50"
                            : "border-gray-300 bg-white hover:border-gray-400"
                      }`}
                      placeholder="أدخل رقم الهاتف (10 أرقام)"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      {errors.phone ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : formData.phone && formData.phone.length === 10 ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Phone className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>يجب أن يكون 10 أرقام</span>
                    <span>{formData.phone?.length || 0}/10</span>
                  </div>
                  <AnimatePresence>
                    {errors.phone && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-500 text-sm flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.phone}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Serial Number */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    الرقم التسلسلي للمركبة
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                    dir="rtl"
                      type="tel"
                      value={formData.serial_number || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          serial_number: onlyNumbers(e.target.value),
                        }))
                      }
                      className={`w-full px-4 py-3 pr-12 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                        errors.serial_number
                          ? "border-red-500 bg-red-50"
                          : formData.serial_number
                            ? "border-green-500 bg-green-50"
                            : "border-gray-300 bg-white hover:border-gray-400"
                      }`}
                      placeholder="أدخل الرقم التسلسلي للمركبة"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      {errors.serial_number ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : formData.serial_number ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Hash className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">الرقم الموجود في استمارة المركبة</p>
                  <AnimatePresence>
                    {errors.serial_number && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-500 text-sm flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.serial_number}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                {/* Vehicle Manufacture Number */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    رقم صنع المركبة
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.vehicle_manufacture_number || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          vehicle_manufacture_number: onlyNumbers(e.target.value),
                        }))
                      }
                      className={`w-full px-4 py-3 pr-12 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                        errors.vehicle_manufacture_number
                          ? "border-red-500 bg-red-50"
                          : formData.vehicle_manufacture_number
                            ? "border-green-500 bg-green-50"
                            : "border-gray-300 bg-white hover:border-gray-400"
                      }`}
                      placeholder="أدخل رقم صنع المركبة"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      {errors.vehicle_manufacture_number ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : formData.vehicle_manufacture_number ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Truck className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">رقم الشاسيه أو رقم المحرك</p>
                  <AnimatePresence>
                    {errors.vehicle_manufacture_number && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-500 text-sm flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.vehicle_manufacture_number}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Customs Code */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    رقم البطاقة الجمركية
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.customs_code || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          customs_code: onlyNumbers(e.target.value),
                        }))
                      }
                      className={`w-full px-4 py-3 pr-12 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                        errors.customs_code
                          ? "border-red-500 bg-red-50"
                          : formData.customs_code
                            ? "border-green-500 bg-green-50"
                            : "border-gray-300 bg-white hover:border-gray-400"
                      }`}
                      placeholder="أدخل رقم البطاقة الجمركية"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      {errors.customs_code ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : formData.customs_code ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <CreditCard className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">الرقم الموجود في البطاقة الجمركية</p>
                  <AnimatePresence>
                    {errors.customs_code && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-500 text-sm flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.customs_code}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Info Box */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">معلومة مهمة</h4>
              <p className="text-sm text-blue-700 leading-relaxed">
                {formData.vehicle_type === "registration"
                  ? "تأكد من إدخال الأرقام كما هي موجودة في استمارة المركبة بدقة لضمان سرعة المعالجة"
                  : "تأكد من إدخال الأرقام كما هي موجودة في البطاقة الجمركية والوثائق الرسمية"}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default VehicleRegistration
