import { ExternalLink, PenSquare, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Member } from "@/lib/people-content"

/** "위원장"이 선택돼 있으면 맡은 위원회 이름과 합쳐 "OO위원회 위원장"으로 보여준다. */
function displayTitles(member: Member): string[] {
  return member.titles.map((title) =>
    title === "위원장" && member.chairedCommitteeName
      ? `${member.chairedCommitteeName}위원회 위원장`
      : title
  )
}

export function MemberCard({
  member,
  isAdmin = false,
  onEdit,
  onDelete,
}: {
  member: Member
  isAdmin?: boolean
  onEdit?: (member: Member) => void
  onDelete?: (member: Member) => void
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
            aria-label={`${member.name} 수정`}
            onClick={() => onEdit?.(member)}
          >
            <PenSquare className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-7 bg-background text-destructive hover:text-destructive"
            aria-label={`${member.name} 삭제`}
            onClick={() => onDelete?.(member)}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      )}

      <CardHeader>
        <div className="flex flex-wrap items-center gap-2 pr-16">
          <CardTitle className="text-base">{member.name}</CardTitle>
          {displayTitles(member).map((title) => (
            <Badge key={title} variant="outline">
              {title}
            </Badge>
          ))}
        </div>
      </CardHeader>

      {member.career.length > 0 && (
        <CardContent>
          <ul className="flex flex-col gap-1.5">
            {member.career.map((item) => (
              <li
                key={item}
                className="text-[0.8125rem] leading-relaxed text-pretty text-muted-foreground"
              >
                · {item}
              </li>
            ))}
          </ul>
        </CardContent>
      )}

      {member.links.length > 0 && (
        <CardFooter className="flex flex-wrap gap-2">
          {member.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <ExternalLink className="size-3.5" strokeWidth={1.5} />
              {link.label}
            </a>
          ))}
        </CardFooter>
      )}
    </Card>
  )
}
