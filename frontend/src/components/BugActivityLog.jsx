import React from 'react';
import { CheckCircle, AlertCircle, Clock, XCircle, PlayCircle } from 'lucide-react';
import { bugData } from '@/lib/DummyData/bug-data';
import { getStatusColor } from '@/lib/colors';
import { formatDate } from '@/lib/utils';

const getStatusIcon = (status) => {
  const iconProps = { size: 12, className: "flex-shrink-0" };

  switch (status.toLowerCase()) {
    case 'closed':
      return <CheckCircle {...iconProps} className="text-green-500" />;
    case 'in_progress':
      return <PlayCircle {...iconProps} className="text-blue-500" />;
    case 'assigned':
      return <Clock {...iconProps} className="text-orange-500" />;
    case 'open':
      return <AlertCircle {...iconProps} className="text-red-500" />;
    case 'resolved':
      return <XCircle {...iconProps} className="text-yellow-500" />; // Or pick a different icon if you prefer
    default:
      return <XCircle {...iconProps} className="text-gray-500" />;
  }
};

export default function ActivityLog({ statusHistory }) {
  return (
    <div className="pt-4 border-t border-border">
      <div className="mb-4">
        <h3 className="text-md text-foreground font-semibold mb-1">Activity Log</h3>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-gray-200 dark:from-gray-700 via-gray-300 dark:via-gray-800 to-transparent"></div>

        <div className="space-y-3">
          {statusHistory.map((activity, index) => (
            <div key={index} className="relative flex items-start gap-3 group">
              {/* Icon container with background */}
              <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-muted border border-border rounded-full duration-200">
                {getStatusIcon(activity.status)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-1">
                <div className="bg-muted rounded-lg border border-border p-2.5 transition-all duration-200 group-hover:border-gray-300 dark:group-hover:border-gray-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(activity.status)}`}>
                      {activity.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-1 text-xs text-muted-foreground">
                    <span className="font-medium m-1">{activity.by}</span>
                    <time className="text-muted-foreground">
                      {formatDate(activity.date)}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}