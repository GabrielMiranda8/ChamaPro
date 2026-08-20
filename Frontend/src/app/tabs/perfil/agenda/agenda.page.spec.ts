import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgendaPagePage } from './agenda.page';

describe('AgendaPagePage', () => {
  let component: AgendaPagePage;
  let fixture: ComponentFixture<AgendaPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
