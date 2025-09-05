import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export const PersonalDetails = ({
  personalDetails,
  handlePersonalChange,
}: {
  personalDetails: Record<string, string>
  handlePersonalChange: (name: string, value: string) => void
}) => {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-foreground text-lg font-semibold">Personal Details</CardTitle>
        <p className="text-muted-foreground text-sm">
          Please provide your information for the electronic signature
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              placeholder="John"
              value={personalDetails.firstName}
              onChange={(e) => handlePersonalChange('firstName', e.target.value)}
              className="bg-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              value={personalDetails.lastName}
              onChange={(e) => handlePersonalChange('lastName', e.target.value)}
              className="bg-input"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              value={personalDetails.email}
              onChange={(e) => handlePersonalChange('email', e.target.value)}
              className="bg-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={personalDetails.phone}
              onChange={(e) => handlePersonalChange('phone', e.target.value)}
              className="bg-input"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Street Address</Label>
          <Input
            id="address"
            placeholder="123 Main Street"
            value={personalDetails.address}
            onChange={(e) => handlePersonalChange('address', e.target.value)}
            className="bg-input"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="New York"
              value={personalDetails.city}
              onChange={(e) => handlePersonalChange('city', e.target.value)}
              className="bg-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              placeholder="NY"
              value={personalDetails.state}
              onChange={(e) => handlePersonalChange('state', e.target.value)}
              className="bg-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              placeholder="10001"
              value={personalDetails.zipCode}
              onChange={(e) => handlePersonalChange('zipCode', e.target.value)}
              className="bg-input"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
