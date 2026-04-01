"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface CategoryCardProps {
  name: string
  slug: string
  image: string
  serviceCount?: number
}

export function CategoryCard({ name, slug, image, serviceCount }: CategoryCardProps) {
  return (
    <Link href={`/services/${slug}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-3">
          <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
            />
          </div>
          <h3 className="font-medium text-sm text-center text-foreground line-clamp-2">
            {name}
          </h3>
          {serviceCount !== undefined && (
            <p className="text-xs text-center text-muted-foreground mt-1">
              {serviceCount} services
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
