import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import type { NodeStatus } from '../../types/graph';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  status?: NodeStatus;
};

export function Badge({ className, status, ...props }: BadgeProps) {
  return <span className={cn('badge', status && `badge-${status.toLowerCase()}`, className)} {...props} />;
}
