import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, AfterViewInit, NgZone, Renderer2, ViewChildren } from '@angular/core';
import { FlowModel } from '../models/flow.model';
import { BoxComponent } from '../box/box.component';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit, AfterViewInit {
  componentRef: any;
  @ViewChild('messagecontainer', { read: ViewContainerRef, static: false }) entry: ViewContainerRef;

  flows: Array<FlowModel> = [
    { id: 0, text: 'Début', nextDependenciesId: [1], timeTriggered: { hour: 13, minute: 55 } },
    { id: 1, text: 'Check your mail', nextDependenciesId: [2] },
    { id: 2, text: 'Do a task', nextDependenciesId: [3] },
    { id: 3, text: 'Write your time' }
  ];
  stateId = 0;
  currentFlow: FlowModel;
  public now: Date = new Date();

  constructor(private resolver: ComponentFactoryResolver) {
      setInterval(() => {
        this.now =  new Date();
        this.checkIfAnEventIsTriggered();
      }
      , 1000);
  }

  ngOnInit() {
    this.currentFlow = this.flows.find(x => x.id === this.stateId);
  }

  ngAfterViewInit() {
    this.onClickGoNext();
    while (this.stateId !== 0) {
      console.log(this.stateId);
      this.onClickGoNext();
    }
  }

  onClickGoNext() {
    if (this.hasOneNextDependencies(this.currentFlow)) {
      this.stateId = this.currentFlow.nextDependenciesId[0];
      this.currentFlow = this.flows.find(x => x.id === this.stateId);
      this.createComponent(this.currentFlow.text);
    } else if (this.hasManyNextDependencies(this.currentFlow)) {
      this.stateId = this.currentFlow.nextDependenciesId[0];
      this.currentFlow = this.flows.find(x => x.id === this.stateId);
    } else {
      this.stateId = 0;
      // this.currentFlow = this.flows.find(x => x.id === this.stateId);
    }
  }

  hasOneNextDependencies(flow: FlowModel) {
    return flow.nextDependenciesId.length === 1;
  }

  hasManyNextDependencies(flow: FlowModel) {
    return flow.nextDependenciesId.length > 1;
  }

  createComponent(message) {
    // this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(BoxComponent);
    this.componentRef = this.entry.createComponent(factory);
    this.componentRef.text = message;
    this.componentRef.instance.text = message;
  }
  destroyComponent() {
    this.componentRef.destroy();
  }

  checkIfAnEventIsTriggered() {
    if (this.now.getSeconds() !== 0) {
      return;
    }
    const currentHour = this.now.getHours();
    const currentMinute = this.now.getMinutes();
    const flowWithTimeTrigger = this.flows.filter(x => x.timeTriggered !== undefined);
    const sameHour = flowWithTimeTrigger.filter(x => x.timeTriggered.hour === currentHour);
    const triggeredEvents =  sameHour.filter(x => x.timeTriggered.minute === currentMinute);

    triggeredEvents.forEach(element => {
      console.log(element.text);
    });
  }
}
