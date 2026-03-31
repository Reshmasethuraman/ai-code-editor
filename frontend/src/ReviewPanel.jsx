import React from 'react'

export default function ReviewPanel({ review, status, errorMsg }) {
  if (status === 'loading') {
    return (
      <div className="review-loading">
        <div className="review-spinner" />
        <span className="review-spinner-text">Analyzing code…</span>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div style={{
        padding: '16px',
        background: 'rgba(255, 71, 87, 0.08)',
        border: '1px solid rgba(255, 71, 87, 0.25)',
        borderRadius: '6px',
        color: '#ff4757',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        lineHeight: 1.6,
      }}>
        <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          ✕ Error
        </div>
        {errorMsg || 'Review failed. Please try again.'}
      </div>
    )
  }

  if (!review) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '200px',
        gap: '12px',
        color: 'var(--text-muted)',
        textAlign: 'center',
        padding: '24px',
      }}>
        <div style={{ fontSize: 28, opacity: 0.4 }}>✦</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
          No review yet
        </div>
        <div style={{ fontSize: 12, lineHeight: 1.6, maxWidth: 220 }}>
          Click <strong style={{ color: 'var(--cyan)' }}>AI Review</strong> to get intelligent feedback on your code.
        </div>
      </div>
    )
  }

  return (
    <div style={{
      fontFamily: 'var(--font-ui)',
      fontSize: 13,
      lineHeight: 1.75,
      color: 'var(--text-secondary)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 14,
        paddingBottom: 10,
        borderBottom: '1px solid var(--border)',
      }}>
        <span style={{ color: 'var(--cyan)', fontSize: 14 }}>✦</span>
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--cyan)',
        }}>
          AI Review
        </span>
        <span style={{
          marginLeft: 'auto',
          fontSize: 10,
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          background: 'var(--bg-elevated)',
          padding: '2px 7px',
          borderRadius: 99,
          border: '1px solid var(--border)',
        }}>
          groq
        </span>
      </div>

      <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {review}
      </div>
    </div>
  )
}