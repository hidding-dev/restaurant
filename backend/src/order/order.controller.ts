import { IOrderResponseDTO } from './order-response.dto';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { TYPES } from 'src/application';
import { IOrderService } from './interface/order-service.interface';
import { CreateOrderDTO } from './dto/create-order.dto';
import { Result } from 'src/domain';

@Controller('orders')
export class OrderController {
  constructor(@Inject(TYPES.IOrderService) private readonly orderService: IOrderService) {}

  @Post()
  async create(@Body() request: CreateOrderDTO): Promise<Result<IOrderResponseDTO>> {
    return this.orderService.createOrder(request);
  }
}
