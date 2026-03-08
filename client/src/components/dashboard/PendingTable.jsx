import { Clock, AlertTriangle } from 'lucide-react';
import { OwnerAvatar } from '../tasks/OwnerAvatar';
import { TagPills } from '../tasks/TagPills';
import { StatusBadge } from '../tasks/StatusBadge';
import { formatDate, isOverdue } from '../../lib/utils';

export function PendingTable({ tasks }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Clock className="w-12 h-12 text-green-500 mb-2" />
        <p className="text-gray-500">No pending tasks!</p>
      </div>
    );
  }
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-gray-500" />
        Pending & Overdue Tasks ({tasks.length})
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Tags</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tasks.map((task) => {
              const overdue = task.dueDate && isOverdue(task.dueDate);
              
              return (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {overdue && <AlertTriangle className="w-4 h-4 text-red-500" />}
                      <div>
                        <div className="font-medium text-gray-900">{task.title}</div>
                        {task.description && (
                          <div className="text-sm text-gray-500 mt-1">{task.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${task.project.color}20`,
                        color: task.project.color,
                      }}
                    >
                      {task.project.name}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <OwnerAvatar user={task.owner} />
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={overdue ? 'text-red-600 font-medium' : 'text-gray-600'}>
                      {task.dueDate ? formatDate(task.dueDate) : '—'}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="py-3 px-4">
                    <TagPills tags={task.tags} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

