'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface AuditLogEntry {
  _id: string;
  action: string;
  entity: string;
  entityId?: string;
  detail: string;
  performedBy: string;
  performedAt: string;
  ip?: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function AuditLogTable() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch('/api/admin/audit-logs');
        const data = await res.json();
        if (data.success) setLogs(data.logs);
      } catch {
        // silently ignore
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--navy, #0D2340)' }} />
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 text-center"
        style={{ border: '1px dashed var(--rule, #C8BFA8)', background: 'white' }}
      >
        <p style={{ fontSize: '15px', color: 'var(--muted, #5C5040)' }}>No audit log entries yet.</p>
        <p style={{ fontSize: '13px', color: 'var(--rule, #C8BFA8)', marginTop: '4px' }}>
          Actions such as adding awardees, uploading students, and deleting templates will appear here.
        </p>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid var(--rule, #C8BFA8)', background: 'white' }}>
      <Table>
        <TableHeader>
          <TableRow style={{ borderBottom: '2px solid var(--navy, #0D2340)' }}>
            <TableHead style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--navy, #0D2340)', width: '120px' }}>Time</TableHead>
            <TableHead style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--navy, #0D2340)', width: '160px' }}>Action</TableHead>
            <TableHead style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--navy, #0D2340)', width: '100px' }}>Entity</TableHead>
            <TableHead style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--navy, #0D2340)' }}>Detail</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log._id} style={{ borderBottom: '1px solid var(--rule, #C8BFA8)' }}>
              <TableCell style={{ fontSize: '12px', color: 'var(--muted, #5C5040)', whiteSpace: 'nowrap' }}>
                {timeAgo(log.performedAt)}
              </TableCell>
              <TableCell>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '10px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
                    color: 'var(--gold, #8C6A1A)',
                    background: 'var(--cream2, #F0EBE0)',
                    padding: '2px 8px',
                  }}
                >
                  {log.action}
                </span>
              </TableCell>
              <TableCell style={{ fontSize: '13px', color: 'var(--navy, #0D2340)', fontWeight: 500 }}>
                {log.entity}
              </TableCell>
              <TableCell style={{ fontSize: '13px', color: 'var(--muted, #5C5040)' }}>
                {log.detail}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
