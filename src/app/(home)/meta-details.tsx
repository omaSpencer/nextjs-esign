import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export const MetaDetails = ({
  contractDetails,
  handleContractChange,
}: {
  contractDetails: Record<string, string>
  handleContractChange: (name: string, value: string) => void
}) => {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-foreground text-lg font-semibold">
          Contract Information
        </CardTitle>
        <p className="text-muted-foreground text-sm">Review the contract details and terms</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contractType">Contract Type</Label>
          <Input
            id="contractType"
            value={contractDetails.contractType}
            onChange={(e) => handleContractChange('contractType', e.target.value)}
            className="bg-input"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={contractDetails.startDate}
              onChange={(e) => handleContractChange('startDate', e.target.value)}
              className="bg-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={contractDetails.endDate}
              onChange={(e) => handleContractChange('endDate', e.target.value)}
              className="bg-input"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            placeholder="Any special terms or conditions..."
            value={contractDetails.notes}
            onChange={(e) => handleContractChange('notes', e.target.value)}
            className="bg-input min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  )
}
