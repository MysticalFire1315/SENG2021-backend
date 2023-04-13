import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { parse } from 'url';
import { ViewService } from './view.service';

@Controller('view')
export class ViewController {
  constructor(private viewService: ViewService) {}

  async handler(req: Request, res: Response) {
    const parsedUrl = parse(req.url, true);
    await this.viewService
      .getNextServer()
      .render(req, res, parsedUrl.pathname, parsedUrl.query);
  }

  @Get('home')
  public async showHome(@Req() req: Request, @Res() res: Response) {
    await this.handler(req, res);
  }
}
