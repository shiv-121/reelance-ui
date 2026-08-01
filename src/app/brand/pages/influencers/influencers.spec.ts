import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Influencers } from './influencers';

describe('Influencers', () => {
  let component: Influencers;
  let fixture: ComponentFixture<Influencers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Influencers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Influencers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
