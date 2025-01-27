import { HttpStatus } from '@nestjs/common';
import {
  ClientSession,
  Connection,
  Document,
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  SaveOptions,
  Types,
  UpdateQuery,
} from 'mongoose';
import { Result } from './../../../domain/result/result';
import { IGenericDocument } from './generic-document.interface';

export abstract class GenericDocumentRepository<TEntity, T extends Document> implements IGenericDocument<TEntity, T> {
  constructor(
    protected readonly DocumentModel: Model<T>,
    readonly connection: Connection,
    private readonly mapper: any,
  ) {}

  async findOne(filterQuery: FilterQuery<T>, projection?: ProjectionType<T | null>): Promise<Result<TEntity | null>> {
    const document = await this.DocumentModel.findOne(filterQuery, projection);
    if (!document) {
      return Result.fail('Error getting documents from database', HttpStatus.NOT_FOUND);
    }
    const entity = this.mapper.toDomain(document);
    return Result.ok(entity);
  }

  async findById(id: any, projection?: ProjectionType<T> | null): Promise<Result<TEntity | null>> {
    const document = await this.DocumentModel.findById(id, projection);
    if (!document) {
      return Result.fail('Error getting documents from database', HttpStatus.NOT_FOUND);
    }
    const entity = this.mapper.toDomain(document);
    return Result.ok(entity);
  }

  async find(
    filterQuery: FilterQuery<T>,
    projection?: ProjectionType<T | null>,
    options?: QueryOptions<T>,
  ): Promise<Result<TEntity[] | null>> {
    const documents = await this.DocumentModel.find(filterQuery, projection, options);
    const entities = documents?.length ? documents.map((document) => this.mapper.toDomain(document)) : [];
    return Result.ok(entities);
  }

  async create(document: any, options?: SaveOptions): Promise<Result<TEntity>> {
    const doc = this.createDocument(document);
    const result = (await (await doc.save(options)).toJSON()) as T;
    if (!result) {
      return Result.fail('An Error occured, unable to save document in the db', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const entity = this.mapper.toDomain(result);
    return Result.ok(entity);
  }

  async findOneAndUpdate(filterQuery: FilterQuery<T>, update: UpdateQuery<T>): Promise<Result<TEntity | null>> {
    const result = await this.DocumentModel.findByIdAndUpdate(filterQuery, update, {
      new: true,
    });
    if (!result) {
      return Result.fail('An Error occured, unable to update the database', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const entity = this.mapper.toDomain(result);
    return Result.ok(entity);
  }

  async upsert(filterQuery: FilterQuery<T>, document: Partial<T>): Promise<unknown> {
    const result = await this.DocumentModel.findOneAndUpdate(filterQuery, document, {
      lean: true,
      upsert: true,
      new: true,
    });

    if (!result) {
      return Result.fail('Unable to update the database', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const entity = this.mapper.toDomain(result);
    return entity;
  }

  async deleteMany(filterQuery: FilterQuery<T>): Promise<boolean> {
    const result = this.DocumentModel.deleteMany(filterQuery);
    return (await result).deletedCount >= 1;
  }

  async deleteOne(filterQuery: FilterQuery<T>): Promise<boolean> {
    const result = this.DocumentModel.deleteOne(filterQuery);
    return (await result).deletedCount === 1;
  }

  async startSession(): Promise<ClientSession> {
    return await this.connection.startSession();
  }

  async insertMany(docs: any): Promise<Result<TEntity[]>> {
    const documentsToSave = docs.map((doc) => this.createDocument(doc));
    const documents = await this.DocumentModel.insertMany(documentsToSave);
    const entities: TEntity[] = documents.map((doc) => this.mapper.toDomain(doc));
    return Result.ok(entities);
  }

  async updateOne(filter: any, query: any): Promise<Result<TEntity>> {
    const document = await this.DocumentModel.updateOne(filter, { $set: query });
    const entity: TEntity = this.mapper.toDomain(document as any);
    return Result.ok(entity);
  }

  createDocument(document: any) {
    return new this.DocumentModel({
      ...document,
      _id: new Types.ObjectId(),
    });
  }
}
