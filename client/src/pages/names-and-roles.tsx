import { useEffect, useState } from 'react'
import { useLtik } from '../lib/use-ltik'
import { apiFetchJson } from '../lib/api'
import { useToast } from '../components/toast'
import { PageShell } from '../components/page-shell'
import { HomeLink } from '../components/home-link'

// The shape of a single entry in /members' JSON response (a subset of ltijs's own `Member` type --
// declared locally rather than imported, since this is the client's view of the wire contract, not the
// library's internal representation).
interface Member {
  userId: string
  name?: string
  roles: string[]
}

export function NamesAndRoles() {
  const ltik = useLtik()
  const toast = useToast()
  const [members, setMembers] = useState<Member[]>()

  useEffect(() => {
    if (ltik === undefined) return
    apiFetchJson<Member[]>(ltik, '/members')
      .then(setMembers)
      .catch((error: unknown) => {
        toast.error(`Failed retrieving members! ${error instanceof Error ? error.message : String(error)}`)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ltik])

  if (ltik === undefined) return null

  return (
    <PageShell wide>
      <h1 className="mb-4 text-lg font-semibold">Members</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-foreground/60">
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 font-medium">Roles</th>
            </tr>
          </thead>
          <tbody>
            {members?.map(member => (
              <tr key={member.userId} className="border-b border-border last:border-0">
                <td className="py-2 pr-4">{member.name ?? member.userId}</td>
                <td className="py-2 text-foreground/70">{member.roles.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {members !== undefined && members.length === 0 && (
          <p className="py-4 text-center text-sm text-foreground/60">No members found.</p>
        )}
      </div>
      <HomeLink ltik={ltik} />
    </PageShell>
  )
}
