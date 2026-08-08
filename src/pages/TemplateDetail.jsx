import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader.jsx'
import Panel from '../components/ui/Panel.jsx'
import Badge from '../components/ui/Badge.jsx'
import { FormSkeleton } from '../components/ui/Skeleton.jsx'
import { IconFile, IconMail } from '../components/Icons.jsx'
import { getAdminTemplate } from '../lib/api.js'
import './TemplateDetail.css'

export default function TemplateDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [template, setTemplate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    getAdminTemplate(id)
      .then(setTemplate)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (error) {
    return (
      <div>
        <PageHeader title="Email Compose Detail" onBack={() => navigate('/templates')} />
        <div className="td-error">{error}</div>
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title={template?.name || 'Email Compose'}
        subtitle={template ? `By ${template.owner?.name || template.owner?.email || 'Unknown'}` : ''}
        onBack={() => navigate('/templates')}
        icon={<IconFile size={22} />}
      />

      {loading ? (
        <FormSkeleton fields={5} />
      ) : (
        <div className="td-content">
          <Panel title="Subject" icon={<IconMail size={16} />}>
            <div className="td-subject">{template.subject || '—'}</div>
          </Panel>

          <Panel title="Body">
            <div
              className="td-body"
              dangerouslySetInnerHTML={{ __html: template.body || '<em>(no content)</em>' }}
            />
          </Panel>

          <div className="td-meta">
            <div className="td-meta__item">
              <span className="td-meta__label">Variables</span>
              <span className="td-meta__value">
                {template.variables?.length > 0
                  ? template.variables.map((v, i) => (
                      <Badge key={i} tone="info">{`{{${v}}}`}</Badge>
                    ))
                  : <span className="td-meta__none">None</span>}
              </span>
            </div>
            <div className="td-meta__item">
              <span className="td-meta__label">Owner</span>
              <span className="td-meta__value">{template.owner?.name || template.owner?.email || 'Unknown'}</span>
            </div>
            <div className="td-meta__item">
              <span className="td-meta__label">Last Updated</span>
              <span className="td-meta__value">{template.updated_at ? new Date(template.updated_at).toLocaleString() : '—'}</span>
            </div>
            <div className="td-meta__item">
              <span className="td-meta__label">Created</span>
              <span className="td-meta__value">{template.created_at ? new Date(template.created_at).toLocaleString() : '—'}</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
