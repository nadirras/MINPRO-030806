import { DashboardController } from '@/controllers/dashboard.controller';
import { Router } from 'express';

export class DashboardRouter {
  private router: Router;
  private dashboardController: DashboardController;

  constructor() {
    this.dashboardController = new DashboardController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/:organizerId',
      this.dashboardController.getEventsByOrganizer.bind(
        this.dashboardController,
      ),
    );
    this.router.get('/', this.dashboardController.getAllEvents);
    this.router.get(
      '/monthly/:year/:month',
      this.dashboardController.getMonthlyReport,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
