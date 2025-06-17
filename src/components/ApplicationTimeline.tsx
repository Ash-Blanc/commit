import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, AlertTriangle, CheckCircle, Plus, Bell } from 'lucide-react';
import { useApplications } from '@/hooks/useApplications';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from '@/hooks/use-toast';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'test' | 'application' | 'financial_aid' | 'scholarship' | 'decision';
  status: 'upcoming' | 'completed' | 'overdue';
  priority: 'high' | 'medium' | 'low';
  college_id?: string;
  reminder_set?: boolean;
}

const ApplicationTimeline = () => {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { applications } = useApplications();
  const { sendNotification } = useNotifications();

  useEffect(() => {
    generateTimelineEvents();
  }, [applications, selectedMonth, selectedYear]);

  const generateTimelineEvents = () => {
    const events: TimelineEvent[] = [];
    const currentDate = new Date();

    // Generate events for each application
    applications.forEach(app => {
      if (app.college?.application_deadline) {
        const deadline = new Date(app.college.application_deadline);
        
        // Application deadline
        events.push({
          id: `app-${app.id}`,
          title: `${app.college.name} Application Due`,
          description: `Submit complete application for ${app.application_type} admission`,
          date: app.college.application_deadline,
          type: 'application',
          status: deadline < currentDate ? 'overdue' : app.status === 'submitted' ? 'completed' : 'upcoming',
          priority: 'high',
          college_id: app.college_id,
          reminder_set: false
        });

        // Financial aid deadline (typically same as application or 2 weeks later)
        const fafsa_deadline = new Date(deadline);
        fafsa_deadline.setDate(fafsa_deadline.getDate() + 14);
        events.push({
          id: `fafsa-${app.id}`,
          title: `${app.college.name} Financial Aid Due`,
          description: 'Submit FAFSA and CSS Profile',
          date: fafsa_deadline.toISOString().split('T')[0],
          type: 'financial_aid',
          status: fafsa_deadline < currentDate ? 'overdue' : 'upcoming',
          priority: 'high',
          college_id: app.college_id,
          reminder_set: false
        });
      }

      if (app.college?.early_deadline) {
        const earlyDeadline = new Date(app.college.early_deadline);
        events.push({
          id: `early-${app.id}`,
          title: `${app.college.name} Early Decision Due`,
          description: 'Submit early decision application',
          date: app.college.early_deadline,
          type: 'application',
          status: earlyDeadline < currentDate ? 'overdue' : 'upcoming',
          priority: 'high',
          college_id: app.college_id,
          reminder_set: false
        });
      }
    });

    // Add standard test dates and deadlines
    const standardEvents: TimelineEvent[] = [
      {
        id: 'sat-dec',
        title: 'SAT Test Date',
        description: 'December SAT administration',
        date: `${selectedYear}-12-07`,
        type: 'test',
        status: 'upcoming',
        priority: 'medium',
        reminder_set: false
      },
      {
        id: 'act-dec',
        title: 'ACT Test Date',
        description: 'December ACT administration',
        date: `${selectedYear}-12-14`,
        type: 'test',
        status: 'upcoming',
        priority: 'medium',
        reminder_set: false
      },
      {
        id: 'fafsa-open',
        title: 'FAFSA Opens',
        description: 'Federal financial aid application becomes available',
        date: `${selectedYear + 1}-01-01`,
        type: 'financial_aid',
        status: 'upcoming',
        priority: 'high',
        reminder_set: false
      }
    ];

    setTimelineEvents([...events, ...standardEvents].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ));
  };

  const setReminder = async (event: TimelineEvent) => {
    const eventDate = new Date(event.date);
    const twoWeeksBefore = new Date(eventDate);
    twoWeeksBefore.setDate(twoWeeksBefore.getDate() - 14);
    
    const oneWeekBefore = new Date(eventDate);
    oneWeekBefore.setDate(oneWeekBefore.getDate() - 7);

    // Set 2-week reminder
    await sendNotification(
      `Reminder: ${event.title}`,
      `${event.description} is due in 2 weeks (${event.date})`,
      'warning',
      true
    );

    // Set 1-week reminder
    await sendNotification(
      `Urgent: ${event.title}`,
      `${event.description} is due in 1 week (${event.date})`,
      'error',
      true
    );

    // Update event to show reminder is set
    setTimelineEvents(prev => 
      prev.map(e => e.id === event.id ? { ...e, reminder_set: true } : e)
    );

    toast({
      title: "Reminders Set",
      description: `You'll be notified 2 weeks and 1 week before ${event.title}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'overdue': return 'bg-red-500';
      case 'upcoming': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'test': return <Clock className="h-4 w-4" />;
      case 'application': return <CheckCircle className="h-4 w-4" />;
      case 'financial_aid': return <AlertTriangle className="h-4 w-4" />;
      case 'scholarship': return <Plus className="h-4 w-4" />;
      case 'decision': return <Bell className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const filteredEvents = timelineEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === selectedMonth && eventDate.getFullYear() === selectedYear;
  });

  const upcomingEvents = timelineEvents.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    return eventDate >= today && eventDate <= thirtyDaysFromNow;
  });

  return (
    <div className="space-y-6">
      {/* Timeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Application Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="px-3 py-2 border rounded-md"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-3 py-2 border rounded-md"
              >
                {Array.from({ length: 3 }, (_, i) => (
                  <option key={i} value={new Date().getFullYear() + i}>
                    {new Date().getFullYear() + i}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-red-50 border-red-200">
                {timelineEvents.filter(e => e.status === 'overdue').length} Overdue
              </Badge>
              <Badge variant="outline" className="bg-blue-50 border-blue-200">
                {upcomingEvents.length} Upcoming
              </Badge>
              <Badge variant="outline" className="bg-green-50 border-green-200">
                {timelineEvents.filter(e => e.status === 'completed').length} Completed
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 border rounded-lg ${getPriorityColor(event.priority)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${getStatusColor(event.status)}`}>
                        {getTypeIcon(event.type)}
                      </div>
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                        <p className="text-sm font-medium text-blue-600">
                          Due: {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="capitalize">
                        {event.priority}
                      </Badge>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                      {!event.reminder_set && event.status === 'upcoming' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setReminder(event)}
                        >
                          <Bell className="h-4 w-4 mr-1" />
                          Set Reminder
                        </Button>
                      )}
                      {event.reminder_set && (
                        <Badge variant="secondary">
                          <Bell className="h-3 w-3 mr-1" />
                          Reminder Set
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No events scheduled for {new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Next 30 Days
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-1 rounded-full ${getStatusColor(event.status)}`}>
                      {getTypeIcon(event.type)}
                    </div>
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(event.status)}>
                    {new Date(event.date).toLocaleDateString()}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              No upcoming deadlines in the next 30 days
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationTimeline;