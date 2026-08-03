import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCaracteristicaPage } from './add-caracteristica.page';

describe('AddCaracteristicaPage', () => {
  let component: AddCaracteristicaPage;
  let fixture: ComponentFixture<AddCaracteristicaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCaracteristicaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
