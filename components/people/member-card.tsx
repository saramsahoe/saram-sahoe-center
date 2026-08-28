import { ExternalLink, GraduationCap, Globe, Mail } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { Member } from "@/lib/people-content"

const socialLinkClass =
  "flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent"

export function MemberCard({ member }: { member: Member }) {
  return (
    <Card className="h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <Dialog>
        <DialogTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            className="cursor-pointer rounded-t-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-base">{member.name}</CardTitle>
                {(member.roles ?? [member.role]).map((role) => (
                  <Badge
                    key={role}
                    variant={
                      member.category === "faculty" ? "accent-soft" : "outline"
                    }
                  >
                    {role}
                  </Badge>
                ))}
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {member.interests.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </CardHeader>

            <CardContent>
              <p className="line-clamp-2 text-[0.8125rem] leading-relaxed text-pretty text-muted-foreground">
                {member.bio}
              </p>
            </CardContent>
          </div>
        </DialogTrigger>

        {(member.scholarUrl || member.websiteUrl || member.email) && (
          <CardFooter className="justify-start gap-2">
            {member.scholarUrl && (
              <a
                href={member.scholarUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} Google Scholar`}
                className={socialLinkClass}
              >
                <GraduationCap className="size-4" strokeWidth={1.5} />
              </a>
            )}
            {member.websiteUrl && (
              <a
                href={member.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} 개인 홈페이지`}
                className={socialLinkClass}
              >
                <Globe className="size-4" strokeWidth={1.5} />
              </a>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                aria-label={`${member.name}에게 이메일 보내기`}
                className={socialLinkClass}
              >
                <Mail className="size-4" strokeWidth={1.5} />
              </a>
            )}
          </CardFooter>
        )}

        <DialogContent className={cn("max-h-[85vh] overflow-y-auto sm:max-w-xl")}>
          <DialogHeader>
            <DialogTitle>{member.name}</DialogTitle>
            <DialogDescription>
              {member.affiliation ?? member.role}
            </DialogDescription>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {member.interests.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </DialogHeader>

          <div className="flex flex-col gap-5">
            <p className="text-[0.875rem] leading-relaxed text-pretty text-foreground">
              {member.fullBio}
            </p>

            {member.career && member.career.length > 0 && (
              <div>
                <h3 className="font-mono text-[0.5625rem] tracking-[0.16em] text-muted-foreground uppercase">
                  주요 경력
                </h3>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {member.career.map((item) => (
                    <li
                      key={item}
                      className="text-[0.8125rem] leading-relaxed text-pretty text-muted-foreground"
                    >
                      · {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {member.activity && member.activity.length > 0 && (
              <div>
                <h3 className="font-mono text-[0.5625rem] tracking-[0.16em] text-muted-foreground uppercase">
                  주요 활동 분야
                </h3>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {member.activity.map((item) => (
                    <li
                      key={item}
                      className="text-[0.8125rem] leading-relaxed text-pretty text-muted-foreground"
                    >
                      · {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {member.publications.length > 0 && (
              <div>
                <h3 className="font-mono text-[0.5625rem] tracking-[0.16em] text-muted-foreground uppercase">
                  Publications
                </h3>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {member.publications.map((pub) => (
                    <li
                      key={pub}
                      className="text-[0.8125rem] leading-relaxed text-pretty text-muted-foreground"
                    >
                      · {pub}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {member.projects.length > 0 && (
              <div>
                <h3 className="font-mono text-[0.5625rem] tracking-[0.16em] text-muted-foreground uppercase">
                  Projects
                </h3>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {member.projects.map((project) => (
                    <li
                      key={project}
                      className="text-[0.8125rem] leading-relaxed text-pretty text-muted-foreground"
                    >
                      · {project}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(member.scholarUrl ||
              member.websiteUrl ||
              member.email ||
              (member.links && member.links.length > 0)) && (
              <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                {member.links?.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    <ExternalLink className="size-3.5" strokeWidth={1.5} />
                    {link.label}
                  </a>
                ))}
                {member.scholarUrl && (
                  <a
                    href={member.scholarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    <GraduationCap className="size-3.5" strokeWidth={1.5} />
                    Google Scholar
                  </a>
                )}
                {member.websiteUrl && (
                  <a
                    href={member.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    <Globe className="size-3.5" strokeWidth={1.5} />
                    개인 홈페이지
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    <Mail className="size-3.5" strokeWidth={1.5} />
                    이메일 보내기
                  </a>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
