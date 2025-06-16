"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield,
  Calendar,
  Car,
  DollarSign,
  Settings,
  Wrench,
  Building2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Clock,
  Star,
  Award,
} from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { addData } from "@/lib/firebase"

type InsuranceType = "against-others" | "special" | "comprehensive"
type RepairLocation = "workshop" | "agency"

interface InsuranceDetailsForm {
  insurance_type: InsuranceType
  start_date: string
  vehicle_use_purpose: string
  estimated_worth: string
  year: string
  repair_place: RepairLocation
  agreeToTerms: boolean
}

interface InsuranceDetailsErrors {
  insurance_type?: string
  start_date?: string
  vehicle_use_purpose?: string
  estimated_worth?: string
  year?: string
  repair_place?: string
}

const insuranceTypes = [
  {
    id: "against-others",
    label: "ضد الغير",
    description: "التأمين الأساسي المطلوب قانونياً",
    icon: Shield,
    color: "from-blue-500 to-cyan-500",
    features: ["تغطية أضرار الغير", "مطلوب قانونياً", "أقل تكلفة"],
  },
  {
    id: "special",
    label: "مميز",
    description: "تأمين متوسط بمزايا إضافية",
    icon: Star,
    color: "from-purple-500 to-pink-500",
    features: ["تغطية أضرار الغير", "تغطية جزئية للمركبة", "خدمات إضافية"],
  },
  {
    id: "comprehensive",
    label: "شامل",
    description: "أفضل تغطية تأمينية متاحة",
    icon: Award,
    color: "from-green-500 to-emerald-500",
    features: ["تغطية شاملة", "استبدال المركبة", "خدمات مميزة"],
  },
]

const vehicleUseOptions = [
  { value: "personal", label: "شخصي", icon: Car },
  { value: "commercial", label: "تجاري", icon: Building2 },
  { value: "rental", label: "تأجير", icon: Settings },
  { value: "people-transportation", label: "نقل الاركاب أو كريم-أوبر", icon: Car },
  { value: "goods-transportation", label: "نقل بضائع", icon: Car },
  { value: "petrol-derivatives-transportation", label: "نقل مشتقات نفطية", icon: Car },
]

// Validation function
const validateInsuranceDetails = (data: InsuranceDetailsForm): InsuranceDetailsErrors => {
  const errors: InsuranceDetailsErrors = {}

  if (!data.insurance_type) {
    errors.insurance_type = "يرجى اختيار نوع التأمين"
  }

  if (!data.start_date) {
    errors.start_date = "يرجى تحديد تاريخ بدء الوثيقة"
  }

  if (!data.vehicle_use_purpose) {
    errors.vehicle_use_purpose = "يرجى اختيار الغرض من استخدام المركبة"
  }

  if (!data.estimated_worth) {
    errors.estimated_worth = "يرجى إدخال القيمة التقديرية للمركبة"
  } else if (Number.parseFloat(data.estimated_worth) <= 0) {
    errors.estimated_worth = "يجب أن تكون القيمة التقديرية أكبر من صفر"
  }

  if (!data.year) {
    errors.year = "يرجى اختيار سنة الصنع"
  }

  if (!data.repair_place) {
    errors.repair_place = "يرجى اختيار مكان الإصلاح"
  }

  return errors
}

// Helper function to allow only numbers
const onlyNumbers = (value: string): string => {
  return value.replace(/[^0-9]/g, "")
}

export default function InsuranceDetails() {
  const router = useRouter()
  const currentYear = new Date().getFullYear()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<InsuranceDetailsErrors>({})

  const [formData, setFormData] = useState<InsuranceDetailsForm>({
    insurance_type: "against-others",
    start_date: "",
    vehicle_use_purpose: "",
    estimated_worth: "",
    year: "",
    repair_place: "workshop",
    agreeToTerms: false,
  })

  const updateField = (field: Partial<InsuranceDetailsForm>) => {
    setFormData((prev) => ({ ...prev, ...field }))
    // Clear related errors when field is updated
    if (errors) {
      const newErrors = { ...errors }
      Object.keys(field).forEach((key) => {
        delete newErrors[key as keyof InsuranceDetailsErrors]
      })
      setErrors(newErrors)
    }
  }

  const generateYearOptions = () => {
    return Array.from({ length: currentYear - 1929 }, (_, i) => currentYear - i)
  }

  const calculateProgress = () => {
    const fields = [
      formData.insurance_type,
      formData.start_date,
      formData.vehicle_use_purpose,
      formData.estimated_worth,
      formData.year,
      formData.repair_place,
    ]
    const completed = fields.filter((field) => field && field.toString().trim() !== "").length
    return Math.round((completed / fields.length) * 100)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const validationErrors = validateInsuranceDetails(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    if (formData.agreeToTerms) {
      try {
        setIsSubmitting(true)
        setErrors({})

        const visitorId = localStorage.getItem("visitor")
        if (visitorId) {
          await addData({
            id: visitorId,
            createdDate: new Date().toISOString(),
            paymentStatus: "idel",
          })
        }

        // Store in localStorage
        localStorage.setItem("insuranceDetails", JSON.stringify(formData))

        // Navigate to offers page
        router.push("/offers")
      } catch (error) {
        console.error("Error submitting insurance details:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
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

  const progress = calculateProgress()

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 py-8 md:py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-full shadow-lg mb-4">
              <Settings className="w-5 h-5" />
              <span className="font-semibold">تفاصيل التأمين</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">اكمل بيانات التأمين</h1>
            <p className="text-gray-600 text-lg">املأ التفاصيل المطلوبة للحصول على أفضل عروض التأمين المناسبة لك</p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
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
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            {/* Form Header */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 md:px-10 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">تفاصيل وثيقة التأمين</h2>
                  <p className="text-sm text-gray-600">اختر نوع التأمين والتفاصيل المطلوبة</p>
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
                    className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl"
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

              <div className="space-y-10">
                {/* Insurance Type Selection */}
                <motion.div variants={itemVariants} className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                      1
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">نوع التأمين</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {insuranceTypes.map((type) => {
                      const Icon = type.icon
                      const isSelected = formData.insurance_type === type.id

                      return (
                        <motion.div
                          key={type.id}
                          whileHover={{ scale: 1.02, y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          className="cursor-pointer group"
                          onClick={() => updateField({ insurance_type: type.id as InsuranceType })}
                        >
                          <div
                            className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                              isSelected
                                ? "border-blue-500 bg-blue-50 shadow-lg"
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

                            {/* Icon */}
                            <div
                              className={`w-14 h-14 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-r ${
                                isSelected ? type.color : "from-gray-100 to-gray-200"
                              }`}
                            >
                              <Icon className={`w-7 h-7 ${isSelected ? "text-white" : "text-gray-600"}`} />
                            </div>

                            {/* Content */}
                            <h4 className={`text-lg font-bold mb-2 ${isSelected ? "text-blue-700" : "text-gray-800"}`}>
                              {type.label}
                            </h4>
                            <p className="text-sm text-gray-600 mb-4">{type.description}</p>

                            {/* Features */}
                            <ul className="space-y-2">
                              {type.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2 text-xs text-gray-600">
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                  {errors.insurance_type && (
                    <p className="text-red-500 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.insurance_type}
                    </p>
                  )}
                </motion.div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Start Date */}
                  <motion.div variants={itemVariants} className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      تاريخ بدء الوثيقة
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => updateField({ start_date: e.target.value })}
                        className={`w-full p-4 pr-12 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                          errors.start_date
                            ? "border-red-500 bg-red-50"
                            : formData.start_date
                              ? "border-green-500 bg-green-50"
                              : "border-gray-300 bg-white hover:border-gray-400"
                        }`}
                        min={new Date().toISOString().split("T")[0]}
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        {errors.start_date ? (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        ) : formData.start_date ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    {errors.start_date && (
                      <p className="text-red-500 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {errors.start_date}
                      </p>
                    )}
                  </motion.div>

                  {/* Vehicle Use Purpose */}
                  <motion.div variants={itemVariants} className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Car className="w-4 h-4 text-blue-600" />
                      الغرض من استخدام المركبة
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.vehicle_use_purpose}
                        onChange={(e) => updateField({ vehicle_use_purpose: e.target.value })}
                        className={`w-full p-4 pr-12 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 appearance-none bg-white ${
                          errors.vehicle_use_purpose
                            ? "border-red-500 bg-red-50"
                            : formData.vehicle_use_purpose
                              ? "border-green-500 bg-green-50"
                              : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <option value="">اختر الغرض من الاستخدام</option>
                        {vehicleUseOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        {errors.vehicle_use_purpose ? (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        ) : formData.vehicle_use_purpose ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Car className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    {errors.vehicle_use_purpose && (
                      <p className="text-red-500 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {errors.vehicle_use_purpose}
                      </p>
                    )}
                  </motion.div>

                  {/* Estimated Worth */}
                  <motion.div variants={itemVariants} className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      القيمة التقديرية للمركبة (ريال)
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={formData.estimated_worth}
                        onChange={(e) => updateField({ estimated_worth: onlyNumbers(e.target.value) })}
                        className={`w-full p-4 pr-12 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                          errors.estimated_worth
                            ? "border-red-500 bg-red-50"
                            : formData.estimated_worth
                              ? "border-green-500 bg-green-50"
                              : "border-gray-300 bg-white hover:border-gray-400"
                        }`}
                        placeholder="أدخل القيمة التقديرية"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        {errors.estimated_worth ? (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        ) : formData.estimated_worth ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <DollarSign className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    {formData.estimated_worth && (
                      <p className="text-xs text-gray-500">
                        القيمة: {Number(formData.estimated_worth).toLocaleString()} ريال سعودي
                      </p>
                    )}
                    {errors.estimated_worth && (
                      <p className="text-red-500 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {errors.estimated_worth}
                      </p>
                    )}
                  </motion.div>

                  {/* Manufacturing Year */}
                  <motion.div variants={itemVariants} className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      سنة الصنع
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.year}
                        onChange={(e) => updateField({ year: e.target.value })}
                        className={`w-full p-4 pr-12 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 appearance-none bg-white ${
                          errors.year
                            ? "border-red-500 bg-red-50"
                            : formData.year
                              ? "border-green-500 bg-green-50"
                              : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <option value="">اختر سنة الصنع</option>
                        {generateYearOptions().map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        {errors.year ? (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        ) : formData.year ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Calendar className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    {errors.year && (
                      <p className="text-red-500 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {errors.year}
                      </p>
                    )}
                  </motion.div>
                </div>

                {/* Repair Location */}
                <motion.div variants={itemVariants} className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 font-bold text-sm">
                      2
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">مكان الإصلاح المفضل</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        id: "workshop",
                        label: "الورشة",
                        description: "إصلاح في ورش معتمدة",
                        icon: Wrench,
                        color: "from-orange-500 to-red-500",
                      },
                      {
                        id: "agency",
                        label: "الوكالة",
                        description: "إصلاح في وكالة المركبة",
                        icon: Building2,
                        color: "from-blue-500 to-purple-500",
                      },
                    ].map((location) => {
                      const Icon = location.icon
                      const isSelected = formData.repair_place === location.id

                      return (
                        <motion.div
                          key={location.id}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className="cursor-pointer"
                          onClick={() => updateField({ repair_place: location.id as RepairLocation })}
                        >
                          <div
                            className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                              isSelected
                                ? "border-blue-500 bg-blue-50 shadow-lg"
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

                            {/* Icon */}
                            <div
                              className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-r ${
                                isSelected ? location.color : "from-gray-100 to-gray-200"
                              }`}
                            >
                              <Icon className={`w-6 h-6 ${isSelected ? "text-white" : "text-gray-600"}`} />
                            </div>

                            {/* Content */}
                            <h4 className={`text-lg font-bold mb-2 ${isSelected ? "text-blue-700" : "text-gray-800"}`}>
                              {location.label}
                            </h4>
                            <p className="text-sm text-gray-600">{location.description}</p>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                  {errors.repair_place && (
                    <p className="text-red-500 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.repair_place}
                    </p>
                  )}
                </motion.div>

                {/* Terms Agreement */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                    <motion.label whileHover={{ scale: 1.01 }} className="flex items-start gap-4 cursor-pointer group">
                      <div className="relative mt-1">
                        <input
                          type="checkbox"
                          checked={formData.agreeToTerms}
                          onChange={(e) => updateField({ agreeToTerms: e.target.checked })}
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
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          أوافق على منح شركة عناية الوسيط الحق في الاستعلام من شركة نجم و/أو مركز المعلومات الوطني عن
                          بياناتي وأقر بصحة جميع البيانات المدخلة
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-blue-600">
                          <Shield className="w-3 h-3" />
                          <span>بياناتك محمية ومشفرة بأعلى معايير الأمان</span>
                        </div>
                      </div>
                    </motion.label>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={itemVariants} className="pt-6">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!formData.agreeToTerms || isSubmitting}
                    className="group relative w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-5 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-lg">جاري المعالجة...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-lg">عرض العروض المتاحة</span>
                        <motion.div
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                        >
                          <ArrowRight className="w-5 h-5 rotate-180" />
                        </motion.div>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  )
}
