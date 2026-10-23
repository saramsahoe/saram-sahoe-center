import { PenSquare, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Committee } from "@/lib/people-content"

export function CommitteeCard({
  committee,
  isAdmin = false,
  onEdit,
  onDelete,
}: {
  committee: Committee
  isAdmin?: boolean
  onEdit?: (committee: Committee) => void
  onDelete?: (committee: Committee) => void
}) {
  return (
    <Card className="relative h-full">
      {isAdmin && (
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-7 bg-background"
            aria-label={`${committee.name}위원회 수정`}
            onClick={() => onEdit?.(committee)}
          >
            <PenSquare className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-7 bg-background text-destructive hover:text-destructive"
            aria-label={`${committee.name}위원회 삭제`}
            onClick={() => onDelete?.(committee)}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      )}

      <CardHeader>
        <CardTitle className="pr-16 text-base">{committee.name}위원회</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-[0.8125rem] leading-relaxed text-pretty text-muted-foreground">
          {committee.description}
        </p>
      </CardContent>
    </Card>
  )
}
