import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';

const ACCEPT = {
  'application/sla': ['.stl'],
  'application/octet-stream': ['.3mf', '.obj'],
  'model/step': ['.step', '.stp'],
};

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileUpload({ onFileSelect, selectedFile, error }) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      onFileSelect({ ...data, originalName: file.name, size: file.size });
    } catch (err) {
      onFileSelect({ error: err.message });
    } finally {
      setUploading(false);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxSize: 100 * 1024 * 1024,
    multiple: false,
  });

  return (
    <div className="file-upload">
      <motion.div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''} ${error ? 'error' : ''}`}
        whileHover={{ borderColor: 'rgba(143, 174, 126, 0.4)' }}
        style={{
          border: `2px dashed ${isDragActive ? 'var(--color-accent-sage)' : error ? 'var(--color-error)' : 'rgba(143, 174, 126, 0.15)'}`,
          borderRadius: '12px',
          padding: '48px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragActive ? 'rgba(143, 174, 126, 0.04)' : 'var(--color-bg-elevated)',
          transition: 'all 0.2s ease',
        }}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div>
            <div className="upload-spinner" />
            <p style={{ color: 'var(--color-text-secondary)', marginTop: '12px' }}>Uploading...</p>
          </div>
        ) : selectedFile && !selectedFile.error ? (
          <div>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>✓</div>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '15px',
              color: 'var(--color-text-primary)',
              marginBottom: '4px',
            }}>
              {selectedFile.originalName}
            </p>
            <p style={{
              fontFamily: 'var(--font-label)',
              fontSize: '13px',
              color: 'var(--color-text-muted)',
            }}>
              {formatSize(selectedFile.size)} · Click to replace
            </p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '36px', marginBottom: '16px', opacity: 0.6 }}>↑</div>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '15px',
              color: 'var(--color-text-primary)',
              marginBottom: '8px',
            }}>
              {isDragActive ? 'Drop your file here' : 'Drag & drop your 3D file'}
            </p>
            <p style={{
              fontFamily: 'var(--font-label)',
              fontSize: '13px',
              color: 'var(--color-text-muted)',
            }}>
              .STL · .3MF · .OBJ · .STEP — Max 100MB
            </p>
          </div>
        )}
      </motion.div>

      {error && (
        <p style={{
          fontFamily: 'var(--font-label)',
          fontSize: '12px',
          color: 'var(--color-error)',
          marginTop: '8px',
        }}>
          {error}
        </p>
      )}

      <style>{`
        .upload-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(143, 174, 126, 0.15);
          border-top-color: var(--color-accent-sage);
          border-radius: 50%;
          margin: 0 auto;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
