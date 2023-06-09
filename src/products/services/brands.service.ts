import { Injectable, NotFoundException } from '@nestjs/common';

import { Brand } from '../entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BrandsService {
  constructor(@InjectModel(Brand.name) private brandModel: Model<Brand>) {}

  async findAll() {
    return await this.brandModel.find().exec();
  }

  async findOne(id: string) {
    const brand = await this.brandModel.findById(id).exec();
    if (!brand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }
    return brand;
  }

  create(data: CreateBrandDto) {
    const newBrand = new this.brandModel(data);
    return newBrand.save();
  }

  update(id: string, changes: UpdateBrandDto) {
    const brand = this.brandModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();

    if (!brand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }

    return brand;
  }

  remove(id: string) {
    return this.brandModel.findByIdAndDelete(id);
  }
}
