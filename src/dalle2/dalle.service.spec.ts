import { Test, TestingModule } from '@nestjs/testing';
import { DalleService } from './dalle.service';
import { HttpException } from '@nestjs/common';

describe('DalleService', () => {
  let service: DalleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DalleService],
    }).compile();

    service = module.get<DalleService>(DalleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a valid prompt', () => {
    const validationResult = service.validatePrompt('foo');
    expect(validationResult).toBe('foo');
  });

  it('should return a httpExceptoin for an invalid prompt', () => {
    expect(() => {
      service.validatePrompt('');
    }).toThrow(HttpException);
  });

  it('should validate the image amount', () => {
    const validationResult = service.validateAmount(3, 'dall-e-2');
    expect(validationResult).toBe(3);
  });

  it('should validate the image amount', () => {
    const validationResult = service.validateAmount(3, 'dall-e-3');
    expect(validationResult).toBe(1);
  });
});
