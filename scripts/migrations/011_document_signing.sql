-- Document Signing tables
-- Created: 2025-12-29

-- Document signing requests
CREATE TABLE IF NOT EXISTS signature_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id VARCHAR(255) UNIQUE, -- HelloSign/DocuSign signature request ID
    title VARCHAR(255) NOT NULL,
    document_type VARCHAR(100), -- 'partner_agreement', 'service_contract', 'nda', etc.
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'viewed', 'signed', 'declined', 'expired'
    requester_id VARCHAR(255) NOT NULL,
    template_id VARCHAR(255),
    file_url TEXT,
    signed_file_url TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document signers
CREATE TABLE IF NOT EXISTS signature_signers (
    id SERIAL PRIMARY KEY,
    request_id UUID REFERENCES signature_requests(id) ON DELETE CASCADE,
    user_id VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(100), -- 'partner', 'client', 'admin', etc.
    sign_order INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'viewed', 'signed', 'declined'
    signed_at TIMESTAMP WITH TIME ZONE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Signature audit log
CREATE TABLE IF NOT EXISTS signature_audit_log (
    id SERIAL PRIMARY KEY,
    request_id UUID REFERENCES signature_requests(id) ON DELETE CASCADE,
    signer_id INTEGER REFERENCES signature_signers(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL, -- 'created', 'sent', 'viewed', 'signed', 'declined', 'expired'
    event_data JSONB DEFAULT '{}',
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_signature_requests_external ON signature_requests(external_id);
CREATE INDEX IF NOT EXISTS idx_signature_requests_requester ON signature_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_signature_requests_status ON signature_requests(status);
CREATE INDEX IF NOT EXISTS idx_signature_requests_type ON signature_requests(document_type);
CREATE INDEX IF NOT EXISTS idx_signature_signers_request ON signature_signers(request_id);
CREATE INDEX IF NOT EXISTS idx_signature_signers_email ON signature_signers(email);
CREATE INDEX IF NOT EXISTS idx_signature_signers_user ON signature_signers(user_id);
CREATE INDEX IF NOT EXISTS idx_signature_audit_request ON signature_audit_log(request_id);
CREATE INDEX IF NOT EXISTS idx_signature_audit_created ON signature_audit_log(created_at DESC);

-- Add comments
COMMENT ON TABLE signature_requests IS 'Document signature requests';
COMMENT ON TABLE signature_signers IS 'Signers for each signature request';
COMMENT ON TABLE signature_audit_log IS 'Audit trail for signature events';
