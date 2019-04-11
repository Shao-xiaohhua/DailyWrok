import { TestBed } from '@angular/core/testing';

import { RestClient } from './rest-client.service';

describe('RestClient', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RestClient = TestBed.get(RestClient);
    expect(service).toBeTruthy();
  });
});
