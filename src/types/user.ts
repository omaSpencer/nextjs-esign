export interface User {
  sub: string
  name: string
  given_name: string
  family_name: string
  created: string
  email: string
  accounts: {
    account_id: string
    is_default: boolean
    account_name: string
    base_uri: string
  }[]
}

export interface EnvelopeStatus {
  envelopeId: string
  status: string
  statusDateTime: string
  emailSubject: string
}