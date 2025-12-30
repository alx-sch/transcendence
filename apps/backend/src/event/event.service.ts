import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Event, Prisma } from '@generated/client/client';
import { ReqEventGetPublishedDto, ReqEventCreateDraftDto } from './event.schema';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  eventGetPublished(input: ReqEventGetPublishedDto) {
    const where: Prisma.EventWhereInput = {
      isPublished: true,
    };
    if (input.search) {
      where.OR = [{ title: { contains: input.search } }, { content: { contains: input.search } }];
    }
    if (input.authorId) {
      where.authorId = input.authorId;
    }
    if (input.startFrom) {
      where.startAt = { gte: input.startFrom };
    }
    if (input.startUntil) {
      where.startAt = { lte: input.startUntil };
    }
    return this.prisma.event.findMany({
      where,
      include: {
        author: true,
      },
    });
  }

  async eventGetById(id: number) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { author: true },
    });
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return event;
  }

  eventCreateDraft(data: ReqEventCreateDraftDto) {
    return this.prisma.event.create({
      data: {
        title: data.title,
        content: data.content,
        startAt: data.startAt,
        endAt: data.endAt,
        isPublic: data.isPublic,
        isPublished: false,
        author: {
          connect: { id: data.authorId },
        },
      },
    });
  }

  async updateEvent(params: {
    where: Prisma.EventWhereUniqueInput;
    data: Prisma.EventUpdateInput;
  }): Promise<Event> {
    const { data, where } = params;
    return this.prisma.event.update({
      data,
      where,
    });
  }

  async deleteEvent(where: Prisma.EventWhereUniqueInput): Promise<Event> {
    return this.prisma.event.delete({
      where,
    });
  }
}
