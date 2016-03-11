import {Component, Directive, Host, ElementRef, Input} from 'angular2/core';
import {Observable} from 'data/observable';
import {TextValueAccessor} from '../nativescript-angular/value-accessors/text-value-accessor';
import {CheckedValueAccessor} from '../nativescript-angular/value-accessors/checked-value-accessor';

@Component({
    selector: 'templated-component',
    directives: [TemplatedComponent],
    templateUrl: 'title.html'
})
export class TemplatedComponent {
    @Input() public renderChild: boolean = false;
    @Input() public text: string = "Hello, external templates";
}

@Directive({
    selector: 'Progress',
})
export class ProgressComponent {
    constructor(private element: ElementRef) {
    }

    ngOnInit() {
        this.element.nativeElement.value = 90;
    }
}

@Component({
	selector: 'renderer-test',
    directives: [TemplatedComponent, ProgressComponent, TextValueAccessor, CheckedValueAccessor],
	template: `
    <StackLayout orientation='vertical'>
        <Progress value="50" style="color: red"></Progress>
        <!--<TimePicker [(ngModel)]='model.deliveryTime' ></TimePicker>
        <Label [text]='model.deliveryTime' ></Label>
        <DatePicker [(ngModel)]='model.deliveryDate' ></DatePicker>-->
        <Label [text]='model.deliveryDate' ></Label>
        <SearchBar [(ngModel)]='model.search'></SearchBar>
        <Label [text]='model.search'></Label>
        <Slider [(ngModel)]='model.sliderTest'></Slider>
        <Label [text]='model.sliderTest'></Label>
        <ListPicker [items]='model.listPickerItems' [(ngModel)]='model.selectedIndex'></ListPicker>
        <TextField [(ngModel)]='model.selectedIndex'></TextField>
        <SegmentedBar [items]='model.segmentedBarItems' [(ngModel)]='model.selectedIndex'></SegmentedBar>
        <Label [text]='model.selectedIndex'></Label>
        <Switch [(ngModel)]='model.testBoolean'></Switch>
        <Label [text]='model.testBoolean'></Label>
        <Label [text]='model.test'></Label>
        <TextView #name [ngModel]='model.test' (ngModelChange)="model.test=setUpperCase($event)" fontSize='20' padding='20'></TextView>
        <Label [class.valid]="isValid" [class.invalid]="!isValid" text='Name' fontSize='20' verticalAlignment='center' padding='20'></Label>
        <TextField #name text='John' fontSize='20' padding='20'></TextField>
        <Button [text]='buttonText' (tap)='onSave($event, name.text, $el)'></Button>
        <Button text='Toggle details' (tap)='onToggleDetails()'></Button>
        <TextView *ngIf='showDetails' [text]='detailsText'></TextView>
        <Label text='==============================' fontSize='20'></Label>
        <StackLayout #more *ngIf='showDetails' orientation='vertical'>
            <TextField *ngFor='#detailLine of detailLines' [text]='detailLine'></TextField>
        </StackLayout>
        <Label text='==============================' fontSize='20'></Label>
        <templated-component [renderChild]="true"></templated-component>
    </StackLayout>
`,
})
export class RendererTest {
    public buttonText: string = "";
    public showDetails: boolean = false;
    public detailsText: string = "";
    public moreDetailsText: string = "";
    public detailLines: Array<string> = [];
    public isValid: boolean = true;
    public model: Observable;

    constructor() {
        this.buttonText = 'Save...'
        this.showDetails = true;
        this.detailsText = 'plain ng-if directive \ndetail 1-2-3...';
        this.moreDetailsText = 'More details:';
        this.model = new Observable({
            'test': 'Jack',
            'testBoolean': false,
            'deliveryDate': new Date(),
            'deliveryTime': new Date(),
            'sliderTest': 0,
            'search': null,
            'selectedIndex': 0,
            'listPickerItems': [
                1,2,3,4,5
            ],
            'segmentedBarItems': [
                {'title': 'first'},
                {'title': 'second'},
                {'title': 'third'}
            ]
        });

        this.detailLines = [
            "ngFor inside a ngIf 1",
            "ngFor inside a ngIf 2",
        ];
    }

    onSave($event, name, $el) {
        console.log('onSave event ' + $event + ' name ' + name);
        alert(name);
    }

    testLoaded($event) {
        console.log("testLoaded called with event args: " + $event);
    }

    onToggleDetails() {
        console.log('onToggleDetails current: ' + this.showDetails);
        this.showDetails = !this.showDetails;
    }

    setUpperCase($event) {
        if ($event.value && $event.value.toUpperCase) {
            return $event.value.toUpperCase();
        }
        if (typeof $event === "string") {
            return $event.toUpperCase();
        }
        return $event;
    }
}
