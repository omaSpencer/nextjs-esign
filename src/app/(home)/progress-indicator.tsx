import { CheckCircle, Clock } from 'lucide-react'

export const ProgressIndicator = () => {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
            <CheckCircle className="text-primary-foreground h-4 w-4" />
          </div>
          <span className="text-sm font-medium">Review Details</span>
        </div>
        <div className="bg-border h-0.5 w-16"></div>
        <div className="flex items-center gap-2">
          <div className="bg-muted border-border flex h-8 w-8 items-center justify-center rounded-full border-2">
            <Clock className="text-muted-foreground h-4 w-4" />
          </div>
          <span className="text-muted-foreground text-sm">Sign Document</span>
        </div>
      </div>
    </div>
  )
}
