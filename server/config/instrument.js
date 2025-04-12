import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
    dsn: 'https://2509435cb3513906f5739eaef5534e95@o4509139837648897.ingest.us.sentry.io/4509139844595712',
    integrations: [nodeProfilingIntegration(), Sentry.mongooseIntegration()],
    // tracesSampleRate: 1.0,
});

Sentry.profiler.startProfiler();

Sentry.startSpan(
    {
        name: 'My first Transaction',
    },
    () => {},
);

Sentry.profiler.stopProfiler();
