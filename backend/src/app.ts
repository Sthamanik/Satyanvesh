import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorHandler from '@middlewares/errorHandler.middleware.js';

const app = express();

// app configuration
app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// routes imports
import authRoute from '@routes/auth.route.js';
import userRoute from '@routes/user.route.js';
import courtRoute from '@routes/court.route.js';
import caseTypeRoute from '@routes/caseType.route.js';
import caseRoute from '@routes/case.routes.js';
import advocateRoute from '@routes/advocate.route.js';
import hearingRoute from '@routes/hearing.route.js';

// route initialization
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/courts', courtRoute);
app.use('/api/v1/case-types', caseTypeRoute);
app.use('/api/v1/cases', caseRoute);
app.use('/api/v1/advocates', advocateRoute);
app.use('/api/v1/hearings', hearingRoute);

// error handling middleware
app.use( errorHandler as any ) 

export default app;