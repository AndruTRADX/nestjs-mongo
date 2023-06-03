import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { Product } from './../entities/product.entity';
import {
  CreateProductDto,
  UpdateProductDto,
  FilterProductsDto,
} from '../dtos/products.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async findAll(param?: FilterProductsDto) {
    if (param) {
      const filters: FilterQuery<Product> = {};
      const { limit, offset } = param;
      const { minPrice, maxPrice } = param;

      if (minPrice && maxPrice) {
        filters.price = { $gte: minPrice, $lte: maxPrice };
      }

      return await this.productModel
        .find(filters)
        .populate('category')
        .populate('brand')
        .skip(offset * limit)
        .limit(limit)
        .exec();
    }
    return await this.productModel.find(param).exec();
  }

  async findOne(id: string) {
    const product = await this.productModel
      .findById(id)
      .populate('category')
      .populate('brand')
      .exec();

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  create(data: CreateProductDto) {
    const newProduct = new this.productModel(data);
    return newProduct.save();
  }

  update(id: string, changes: UpdateProductDto) {
    const product = this.productModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return product;
  }

  remove(id: string) {
    return this.productModel.findByIdAndDelete(id);
  }
}
