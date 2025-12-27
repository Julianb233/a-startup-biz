export interface Consultation {
  id: string
  date: string
  time: string
  type: ConsultationType
  status: ConsultationStatus
  meetingUrl?: string
  notes?: string
  duration: number
  consultant: {
    name: string
    title: string
    avatar?: string
  }
}

export type ConsultationType =
  | "Clarity Call"
  | "Strategy Session"
  | "Business Formation"
  | "Growth Planning"
  | "Marketing Review"
  | "Financial Planning"

export type ConsultationStatus = "Scheduled" | "Completed" | "Cancelled" | "Rescheduled"

export const consultationsData: Consultation[] = [
  {
    id: "1",
    date: "2025-01-15",
    time: "2:00 PM",
    type: "Strategy Session",
    status: "Scheduled",
    duration: 60,
    meetingUrl: "https://zoom.us/j/123456789",
    consultant: {
      name: "Sarah Johnson",
      title: "Business Strategy Consultant",
      avatar: "/avatars/sarah.jpg",
    },
    notes: "Prepare Q4 metrics and growth goals for discussion",
  },
  {
    id: "2",
    date: "2025-01-20",
    time: "10:00 AM",
    type: "Marketing Review",
    status: "Scheduled",
    duration: 45,
    meetingUrl: "https://zoom.us/j/987654321",
    consultant: {
      name: "Michael Chen",
      title: "Digital Marketing Specialist",
      avatar: "/avatars/michael.jpg",
    },
    notes: "Review social media strategy and Q1 campaign planning",
  },
  {
    id: "3",
    date: "2024-12-20",
    time: "3:00 PM",
    type: "Clarity Call",
    status: "Completed",
    duration: 30,
    consultant: {
      name: "Emily Rodriguez",
      title: "Business Development Manager",
      avatar: "/avatars/emily.jpg",
    },
    notes: "Initial consultation completed. Discussed business vision and next steps. Recommended Strategy Session for detailed planning.",
  },
  {
    id: "4",
    date: "2024-12-10",
    time: "1:00 PM",
    type: "Business Formation",
    status: "Completed",
    duration: 90,
    consultant: {
      name: "David Park",
      title: "Legal & Formation Specialist",
      avatar: "/avatars/david.jpg",
    },
    notes: "Reviewed LLC formation documents. Filed with state. EIN application submitted. Next: Operating Agreement review.",
  },
  {
    id: "5",
    date: "2024-11-28",
    time: "11:00 AM",
    type: "Financial Planning",
    status: "Completed",
    duration: 60,
    consultant: {
      name: "Jennifer Williams",
      title: "Financial Advisor",
      avatar: "/avatars/jennifer.jpg",
    },
    notes: "Set up QuickBooks integration. Reviewed expense categories and tax planning strategies for 2025.",
  },
  {
    id: "6",
    date: "2024-11-15",
    time: "4:00 PM",
    type: "Growth Planning",
    status: "Cancelled",
    duration: 45,
    consultant: {
      name: "Robert Thompson",
      title: "Growth Strategist",
      avatar: "/avatars/robert.jpg",
    },
    notes: "Cancelled due to scheduling conflict. Rescheduled to Jan 2025.",
  },
]

export function getUpcomingConsultations(): Consultation[] {
  const today = new Date()
  return consultationsData
    .filter((consultation) => {
      const consultationDate = new Date(consultation.date)
      return consultationDate >= today && consultation.status === "Scheduled"
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export function getPastConsultations(): Consultation[] {
  const today = new Date()
  return consultationsData
    .filter((consultation) => {
      const consultationDate = new Date(consultation.date)
      return (
        consultationDate < today ||
        consultation.status === "Completed" ||
        consultation.status === "Cancelled"
      )
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getConsultationById(id: string): Consultation | undefined {
  return consultationsData.find((consultation) => consultation.id === id)
}

export function formatConsultationDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function getStatusColor(status: ConsultationStatus): string {
  switch (status) {
    case "Scheduled":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Completed":
      return "bg-green-100 text-green-800 border-green-200"
    case "Cancelled":
      return "bg-red-100 text-red-800 border-red-200"
    case "Rescheduled":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function getTypeColor(type: ConsultationType): string {
  switch (type) {
    case "Clarity Call":
      return "from-purple-500 to-purple-600"
    case "Strategy Session":
      return "from-[#ff6a1a] to-[#e55f17]"
    case "Business Formation":
      return "from-blue-500 to-blue-600"
    case "Growth Planning":
      return "from-green-500 to-green-600"
    case "Marketing Review":
      return "from-pink-500 to-pink-600"
    case "Financial Planning":
      return "from-indigo-500 to-indigo-600"
    default:
      return "from-gray-500 to-gray-600"
  }
}
