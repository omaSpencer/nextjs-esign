import type { User } from '@/types/user'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function UserInfoForm({
  sub,
  email,
  name,
  given_name,
  family_name,
  created,
  accounts,
}: User) {
  const basicFields = [
    {
      id: 'email',
      label: 'Email Address',
      value: email,
    },
    {
      id: 'name',
      label: 'Name',
      value: name,
    },
    {
      id: 'given_name',
      label: 'First Name',
      value: given_name,
    },
    {
      id: 'family_name',
      label: 'Last Name',
      value: family_name,
    },
    {
      id: 'sub',
      label: 'User ID',
      value: sub,
    },
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6 lg:pb-10 xl:pb-16">
      <Card className="border-muted">
        <CardHeader>
          <CardTitle className="text-primary text-2xl">User Profile</CardTitle>
          <CardDescription className="text-muted-foreground">
            Read-only user information and account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {basicFields.map(({ id, label, value }) => (
              <div key={id} className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  {label}
                </Label>
                <Input
                  id={id}
                  value={value}
                  disabled
                  readOnly
                  className="bg-muted text-muted-foreground"
                />
              </div>
            ))}

            <div className="space-y-2">
              <Label htmlFor="created" className="text-foreground font-medium">
                Account Created
              </Label>
              <Input
                id="created"
                value={new Date(created).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                disabled
                readOnly
                className="bg-muted text-muted-foreground"
              />
            </div>
          </div>

          <Separator className="bg-muted" />

          <div>
            <h3 className="text-primary mb-4 text-lg font-semibold">Connected Accounts</h3>
            <div className="space-y-4">
              {accounts.map((account) => (
                <Card key={account.account_id} className="border-muted bg-secondary/20">
                  <CardContent className="pt-4">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h4 className="text-foreground font-medium">{account.account_name}</h4>
                        <p className="text-muted-foreground text-sm">ID: {account.account_id}</p>
                      </div>
                      {account.is_default && (
                        <Badge variant="default" className="bg-primary text-primary-foreground">
                          Default
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-foreground text-sm font-medium">Account ID</Label>
                        <Input
                          value={account.account_id}
                          disabled
                          className="bg-muted text-muted-foreground text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-foreground text-sm font-medium">Base URI</Label>
                        <Input
                          value={account.base_uri}
                          disabled
                          className="bg-muted text-muted-foreground text-sm"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="bg-muted" />

          <div className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-primary font-semibold">Account Status</h3>
                <p className="text-muted-foreground text-sm">
                  This account is active with {accounts.length} connected account
                  {accounts.length !== 1 ? 's' : ''}
                </p>
              </div>
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                Active
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
