"use client"

import Image from "next/image"
import { Star, Clock, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"

interface ServiceCardProps {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  duration: number
  rating: number
  reviewCount: number
  image: string
  quantity?: number
  onAdd?: () => void
  onRemove?: () => void
  onClick?: () => void
}

export function ServiceCard({
  name,
  description,
  price,
  originalPrice,
  duration,
  rating,
  reviewCount,
  image,
  quantity = 0,
  onAdd,
  onRemove,
  onClick,
}: ServiceCardProps) {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <Card className="overflow-hidden" onClick={onClick}>
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">{name}</h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-muted-foreground">({reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{duration} mins</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">{formatPrice(price)}</span>
              {originalPrice && originalPrice > price && (
                <>
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(originalPrice)}
                  </span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                    {discount}% off
                  </Badge>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{description}</p>
          </div>
          <div className="relative flex-shrink-0">
            <Image
              src={image}
              alt={name}
              width={100}
              height={100}
              className="rounded-lg object-cover w-24 h-24"
            />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
              {quantity === 0 ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-4 bg-background border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAdd?.()
                  }}
                >
                  Add
                </Button>
              ) : (
                <div className="flex items-center gap-1 bg-primary rounded-md">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-primary-foreground hover:bg-primary/80"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemove?.()
                    }}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-6 text-center text-primary-foreground font-medium">
                    {quantity}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-primary-foreground hover:bg-primary/80"
                    onClick={(e) => {
                      e.stopPropagation()
                      onAdd?.()
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
