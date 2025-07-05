// Minimal DocuSign envelope types for REST API usage

export interface EnvelopeDefinition {
  emailSubject: string;
  documents: Array<{
    documentBase64: string;
    name: string;
    fileExtension: string;
    documentId: string;
  }>;
  recipients: {
    signers: Array<{
      email: string;
      name: string;
      recipientId: string;
      routingOrder: string;
      tabs: {
        signHereTabs: Array<{
          anchorString: string;
          anchorUnits: string;
          anchorXOffset: string;
          anchorYOffset: string;
        }>;
        dateSignedTabs: Array<{
          anchorString: string;
          anchorUnits: string;
          anchorXOffset: string;
          anchorYOffset: string;
        }>;
      };
    }>;
  };
  status: string;
}

export interface EnvelopeSummary {
  envelopeId: string;
  status: string;
  statusDateTime?: string;
  [key: string]: unknown;
}

export interface Envelope {
  [key: string]: {
    [key: string]: unknown;
  };
}

export interface EnvelopesInformation {
  totalSetSize: string;
  envelopes: Envelope[];
  [key: string]: unknown;
} 