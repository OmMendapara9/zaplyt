"use client"

import Link from "next/link"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice, formatDate } from "@/lib/utils"

interface BookingCardProps {
  id: string
  serviceName: string
  providerName?: string
  date: string
  time: string
  address: string
  totalAmount: number
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled"
  href?: string
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  in_progress: "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
}

const statusLabels = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
}

export function BookingCard({
  id,
  serviceName,
  providerName,
  date,
  time,
  address,
  totalAmount,
  status,
  href,
}: BookingCardProps) {
  const content = (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-foreground">{serviceName}</h3>
            {providerName && (
              <p className="text-sm text-muted-foreground">by {providerName}</p>
            )}
          </div>
          <Badge className={statusColors[status]}>{statusLabels[status]}</Badge>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(date)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{address}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
          <span className="text-sm text-muted-foreground">Total Amount</span>
          <span className="font-semibold text-foreground">{formatPrice(totalAmount)}</span>
        </div>
      </CardContent>
    </Card>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
