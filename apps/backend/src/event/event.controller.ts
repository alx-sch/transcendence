import { Controller, Get, Param, Post, Body, Put, Delete, Query } from '@nestjs/common';
import { EventService } from './event.service';
import { Event as EventModel } from '@generated/client/client';
import {
  ReqEventGetPublishedDto,
  ReqEventGetByIdDto,
  ReqEventCreateDraftDto,
  ResEventGetPublishedSchema,
  ResEventGetByIdSchema,
} from './event.schema';
import { ZodSerializerDto } from 'nestjs-zod';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @ZodSerializerDto(ResEventGetPublishedSchema)
  eventGetPublished(@Query() query: ReqEventGetPublishedDto) {
    return this.eventService.eventGetPublished(query);
  }

  @Get(':id')
  @ZodSerializerDto(ResEventGetByIdSchema)
  eventGetById(@Param() param: ReqEventGetByIdDto) {
    return this.eventService.eventGetById(param.id);
  }

  @Post()
  eventCreateDraft(@Body() eventData: ReqEventCreateDraftDto) {
    return this.eventService.eventCreateDraft(eventData);
  }

  @Put(':id/publish')
  async eventPublish(@Param('id') id: string): Promise<EventModel> {
    return this.eventService.updateEvent({
      where: { id: Number(id) },
      data: { isPublished: true },
    });
  }

  @Delete(':id')
  async eventDelete(@Param('id') id: string): Promise<EventModel> {
    return this.eventService.deleteEvent({ id: Number(id) });
  }
}
