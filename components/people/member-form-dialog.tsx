"use client"

import { useState, type FormEvent } from "react"

import type { OrgMemberInput } from "@/app/actions/org-members"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Member, MemberCategory } from "@/lib/people-content"

const categoryOptions: { value: MemberCategory; label: string }[] = [
  { value: "board", label: "이사회" },
  { value: "committee", label: "위원회" },
  { value: "office", label: "사무국" },
]

function linesToArray(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
}

function arrayToLines(value?: string[]): string {
  return (value ?? []).join("\n")
}

function linksToLines(links?: { label: string; url: string }[]): string {
  return (links ?? []).map((link) => `${link.label}|${link.url}`).join("\n")
}

function linesToLinks(value: string): { label: string; url: string }[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, url] = line.split("|").map((part) => part.trim())
      return { label: label ?? "", url: url ?? "" }
    })
    .filter((link) => link.label && link.url)
}

export function MemberFormDialog({
  open,
  onOpenChange,
  editingMember,
  onSubmit,
  error,
  submitting,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingMember?: Member | null
  onSubmit: (values: OrgMemberInput) => void | Promise<void>
  error?: string | null
  submitting?: boolean
}) {
  const [name, setName] = useState(editingMember?.name ?? "")
  const [role, setRole] = useState(editingMember?.role ?? "")
  const [roles, setRoles] = useState(arrayToLines(editingMember?.roles))
  const [category, setCategory] = useState<MemberCategory>(
    editingMember?.category ?? "committee"
  )
  const [interests, setInterests] = useState(arrayToLines(editingMember?.interests))
  const [bio, setBio] = useState(editingMember?.bio ?? "")
  const [affiliation, setAffiliation] = useState(editingMember?.affiliation ?? "")
  const [activity, setActivity] = useState(arrayToLines(editingMember?.activity))
  const [career, setCareer] = useState(arrayToLines(editingMember?.career))
  const [publications, setPublications] = useState(
    arrayToLines(editingMember?.publications)
  )
  const [projects, setProjects] = useState(arrayToLines(editingMember?.projects))
  const [email, setEmail] = useState(editingMember?.email ?? "")
  const [scholarUrl, setScholarUrl] = useState(editingMember?.scholarUrl ?? "")
  const [websiteUrl, setWebsiteUrl] = useState(editingMember?.websiteUrl ?? "")
  const [links, setLinks] = useState(linksToLines(editingMember?.links))

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim()) return
    onSubmit({
      name: name.trim(),
      role,
      roles: linesToArray(roles),
      category,
      interests: linesToArray(interests),
      bio,
      affiliation,
      activity: linesToArray(activity),
      career: linesToArray(career),
      publications: linesToArray(publications),
      projects: linesToArray(projects),
      email,
      scholarUrl,
      websiteUrl,
      links: linesToLinks(links),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingMember ? "구성원 수정" : "구성원 추가"}</DialogTitle>
          <DialogDescription>
            여러 항목이 있는 필드는 한 줄에 하나씩 입력하세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="member-name">이름</FieldLabel>
                <Input
                  id="member-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="member-category">분류</FieldLabel>
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value as MemberCategory)}
                >
                  <SelectTrigger id="member-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="member-role">대표 직함</FieldLabel>
                <Input
                  id="member-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="예: 이사"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="member-affiliation">소속 및 직위</FieldLabel>
                <Input
                  id="member-affiliation"
                  value={affiliation}
                  onChange={(e) => setAffiliation(e.target.value)}
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="member-roles">
                뱃지에 표시할 직함{" "}
                <span className="font-normal text-muted-foreground">
                  (줄바꿈으로 구분, 비우면 대표 직함 하나만 표시)
                </span>
              </FieldLabel>
              <Textarea
                id="member-roles"
                value={roles}
                onChange={(e) => setRoles(e.target.value)}
                className="min-h-16"
                placeholder={"이사\n거버넌스위원회 위원장"}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="member-bio">소개</FieldLabel>
              <Textarea
                id="member-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="min-h-24"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="member-interests">
                관심 분야 태그{" "}
                <span className="font-normal text-muted-foreground">(줄바꿈으로 구분)</span>
              </FieldLabel>
              <Textarea
                id="member-interests"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="min-h-16"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="member-activity">
                주요 활동 분야{" "}
                <span className="font-normal text-muted-foreground">(줄바꿈으로 구분)</span>
              </FieldLabel>
              <Textarea
                id="member-activity"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="min-h-16"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="member-career">
                주요 경력{" "}
                <span className="font-normal text-muted-foreground">(줄바꿈으로 구분)</span>
              </FieldLabel>
              <Textarea
                id="member-career"
                value={career}
                onChange={(e) => setCareer(e.target.value)}
                className="min-h-20"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="member-publications">
                Publications{" "}
                <span className="font-normal text-muted-foreground">(줄바꿈으로 구분)</span>
              </FieldLabel>
              <Textarea
                id="member-publications"
                value={publications}
                onChange={(e) => setPublications(e.target.value)}
                className="min-h-16"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="member-projects">
                Projects{" "}
                <span className="font-normal text-muted-foreground">(줄바꿈으로 구분)</span>
              </FieldLabel>
              <Textarea
                id="member-projects"
                value={projects}
                onChange={(e) => setProjects(e.target.value)}
                className="min-h-16"
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="member-email">이메일</FieldLabel>
                <Input
                  id="member-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="member-scholar">Google Scholar URL</FieldLabel>
                <Input
                  id="member-scholar"
                  value={scholarUrl}
                  onChange={(e) => setScholarUrl(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="member-website">개인 홈페이지 URL</FieldLabel>
                <Input
                  id="member-website"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="member-links">
                참고 링크{" "}
                <span className="font-normal text-muted-foreground">
                  (한 줄에 &quot;라벨|URL&quot; 형식으로)
                </span>
              </FieldLabel>
              <Textarea
                id="member-links"
                value={links}
                onChange={(e) => setLinks(e.target.value)}
                className="min-h-16"
                placeholder={"교보문고 저자 소개|https://..."}
              />
            </Field>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                취소
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-button text-button-foreground hover:bg-button/90"
              >
                {submitting ? "저장 중..." : "저장하기"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
