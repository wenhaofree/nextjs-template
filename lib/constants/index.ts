export const API_ENDPOINTS = {
  updatePlan: '/api/user/update-plan',
  getPlan: '/api/user/plan',
  webhook: '/api/stripe/webhook'
} as const

export const FEATURES = [
  {
    title: "来自100个国家的观众",
    description: "最受欢迎的观众来自美国、英国、加拿大、中国、日本、韩国、印度、法国、新加坡...",
    icon: 'Globe',
  },
  // ... 其他特性
] as const

export const FAQS = [
  {
    question: "[AI With Me]什么时候会白名单的工具?",
    answer: "我们会在收到提交后的48小时内审核您的工具。"
  },
  // ... 其他FAQ
] as const 