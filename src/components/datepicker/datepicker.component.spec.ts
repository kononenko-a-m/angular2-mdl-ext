
import { CURRENT_DATE, DATEPICKER_CONFIG, DatePickerDialogComponent } from './datepicker.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { MdlButtonModule, MdlDialogReference, MdlIconModule, MdlRippleModule } from '@angular-mdl/core';
import { Subject } from 'rxjs/Subject';
import * as moment from 'moment';


class MdlDialogMockReference {

    onVisible() {
        return new Subject<any>().asObservable();
    }

    hide(date: Date) {}
}

describe('DatePickerDialogComponent', () => {


    let fixture: ComponentFixture<DatePickerDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                MdlButtonModule,
                MdlIconModule,
                MdlRippleModule
            ],
            declarations: [DatePickerDialogComponent],
            providers: [
                { provide: MdlDialogReference, useClass: MdlDialogMockReference },
                { provide: CURRENT_DATE, useValue: null},
                { provide: DATEPICKER_CONFIG, useValue: {}}
            ]
        });

        TestBed.compileComponents().then( () => {
            fixture = TestBed.createComponent(DatePickerDialogComponent);
            fixture.detectChanges();
        });
    }));

    it('should instantiate the component', async(() => {
        expect(fixture).toBeDefined();
    }));

    it('should call hide with null on cancel', async(() => {
        let dialogRef: MdlDialogReference = TestBed.get(MdlDialogReference);
        spyOn(dialogRef, 'hide');
        fixture.componentInstance.onCancel();
        expect(dialogRef.hide).toHaveBeenCalledWith(null);
    }));

    it('should call hide with null on esc', async(() => {
        let dialogRef: MdlDialogReference = TestBed.get(MdlDialogReference);
        spyOn(dialogRef, 'hide');
        fixture.componentInstance.onEsc();
        expect(dialogRef.hide).toHaveBeenCalledWith(null);
    }));

    it('should call hide with actual date on ok', async(() => {
        let dialogRef: MdlDialogReference = TestBed.get(MdlDialogReference);
        spyOn(dialogRef, 'hide');
        fixture.componentInstance.onOk();
        expect(dialogRef.hide).toHaveBeenCalledWith(fixture.componentInstance.mDate.toDate());
    }));

    it('should show the current date - because we did not provide a date', async(() => {
        expect(fixture.componentInstance.mDate.isSame(moment(), 'day')).toBeTruthy();
        expect(fixture.componentInstance.mCurrentMonth.isSame(fixture.componentInstance.mDate, 'day')).toBeTruthy();
    }));

    it('should be possible to set a specific date', async(() => {
        fixture.componentInstance.setCurrentDay(moment('2017-01-01'));
        expect(fixture.componentInstance.mDate.isSame(moment('2017-01-01'), 'day')).toBeTruthy();
    }));

    it('should be possible to go to the next month', async(() => {
        fixture.componentInstance.mCurrentMonth = moment('2017-01-01');
        fixture.componentInstance.nextMonth();

        expect(fixture.componentInstance.mCurrentMonth.isSame(moment('2017-02-01'), 'month')).toBeTruthy();

        // but this should not change the actual date
        expect(fixture.componentInstance.mDate.isSame(moment(), 'day')).toBeTruthy();
    }));

    it('should be possible to go to the prev month', async(() => {
        fixture.componentInstance.mCurrentMonth = moment('2017-01-01');
        fixture.componentInstance.prevMonth();

        expect(fixture.componentInstance.mCurrentMonth.isSame(moment('2016-12-01'), 'month')).toBeTruthy();

        // but this should not change the actual date
        expect(fixture.componentInstance.mDate.isSame(moment(), 'day')).toBeTruthy();
    }));

    it('should create an array with the week days for en locale', async(() => {
        fixture.componentInstance.mCurrentMonth = moment('2017-01-01');
        expect(fixture.componentInstance.monthGridWeekDays).toEqual(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);
    }));

    it('should create an array with all days for the current month', async(() => {
        fixture.componentInstance.mDate = moment('2017-04-10');
        fixture.componentInstance.mCurrentMonth = moment('2017-04-01');

        let gridWithDays = fixture.componentInstance.monthGridDays;

        // the first date should be 2017/3/25 - e.g. not the current month and not the actual date
        let day1 = gridWithDays[0].days[0];
        expect(day1.day.isSame(moment('2017-03-26'), 'day')).toBeTruthy('should be the 2017-03-26');
        expect(fixture.componentInstance.isActualDate(day1.day)).toBeFalsy('first day is not the actual');
        expect(day1.isCurrentMonth).toBeFalsy('first day is not in the current month');

        // the third week the 2snd day ist 2017-04-10
        let dayActual = gridWithDays[2].days[1];
        expect(dayActual.day.isSame(moment('2017-04-10'), 'day')).toBeTruthy('should be 2017-04-10');
        expect(fixture.componentInstance.isActualDate(dayActual.day)).toBeTruthy('the 10. is the actual day');
        expect(dayActual.isCurrentMonth).toBeTruthy('the 10 is in the current month');

        let lastDayOfTheMonth = gridWithDays[5].days[0];
        expect(lastDayOfTheMonth.day.isSame(moment('2017-04-30'), 'day')).toBeTruthy('should be 2017-04-30');
        expect(fixture.componentInstance.isActualDate(lastDayOfTheMonth.day)).toBeFalsy('30. is not the actual day');
        expect(lastDayOfTheMonth.isCurrentMonth).toBeTruthy('the 30 is in the current month');
    }));
    /**
 [
     {
        "week": 13,
        "days": [
           {
              "day": "2017-03-25T23:00:00.000Z",
              "isActual": false,
              "isCurrentMonth": false
           },

        ]
     },
     {
        "week": 14,
        "days": [

        ]
     },
     {
        "week": 15,
        "days": [
           {
              "day": "2017-04-08T22:00:00.000Z",
              "isActual": false,
              "isCurrentMonth": true
           },
           {
              "day": "2017-04-09T22:00:00.000Z",
              "isActual": true,
              "isCurrentMonth": true
           },

        ]
     },
     {
        "week": 16,
        "days": [

        ]
     },
     {
        "week": 17,
        "days": [

        ]
     },
     {
        "week": 18,
        "days": [
           {
              "day": "2017-04-29T22:00:00.000Z",
              "isActual": false,
              "isCurrentMonth": true
           },
           {
              "day": "2017-04-30T22:00:00.000Z",
              "isActual": false,
              "isCurrentMonth": false
           },

        ]
     }
 ]
 */

});