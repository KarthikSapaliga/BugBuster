import React from 'react';
import { CheckCircle, AlertCircle, Clock, XCircle, PlayCircle } from 'lucide-react';
import { bugData } from '@/lib/DummyData/bug-data';

const getStatusIcon = (status) => {
  const iconProps = { size: 12, className: "flex-shrink-0" };

  switch (status.toLowerCase()) {
    case 'resolved':
      return <CheckCircle {...iconProps} className="text-green-500" />;
    case 'in progress':
      return <PlayCircle {...iconProps} className="text-blue-500" />;
    case 'assigned':
      return <Clock {...iconProps} className="text-orange-500" />;
    case 'open':
      return <AlertCircle {...iconProps} className="text-red-500" />;
    case 'closed':
      return <XCircle {...iconProps} className="text-yellow-500" />; // Or pick a different icon if you prefer
    default:
      return <XCircle {...iconProps} className="text-gray-500" />;
  }
};

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'resolved':
      return 'text-green-700 bg-green-50 border-green-200';
    case 'in progress':
      return 'text-blue-700 bg-blue-50 border-blue-200';
    case 'assigned':
      return 'text-orange-700 bg-orange-50 border-orange-200';
    case 'open':
      return 'text-red-700 bg-red-50 border-red-200';
    case 'closed':
      return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    default:
      return 'text-gray-700 bg-gray-50 border-gray-200';
  }
};


export default function ActivityLog({statusHistory}) {
  console.log(statusHistory);
  return (
    <div className="pt-4 border-t border-border">
      <div className="mb-4">
        <h3 className="text-md text-foreground font-semibold mb-1">Activity Log</h3>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-gray-200 via-gray-300 to-transparent"></div>

        <div className="space-y-3">
          {statusHistory.map((activity, index) => (
            <div key={index} className="relative flex items-start gap-3 group">
              {/* Icon container with background */}
              <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-background border border-gray-200 rounded-full duration-200">
                {getStatusIcon(activity.status)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-1">
                <div className="bg-background rounded-lg border border-gray-200 p-2.5 transition-all duration-200 group-hover:border-gray-300">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-1 text-xs text-muted-foreground">
                    <span className="font-medium">{activity.by}</span>
                    <time className="text-gray-500">
                      {new Date(activity.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
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