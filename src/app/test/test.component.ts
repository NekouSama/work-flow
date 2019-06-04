import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
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
    { id: 0, text: 'Début', nextDependenciesId: [1] },
    { id: 1, text: 'Regarder mes mails', nextDependenciesId: [2] },
    { id: 2, text: 'Accomplir une tâche', nextDependenciesId: [3] },
    { id: 3, text: 'Mettre les temps dans GroupCamp' }
  ];
  stateId = 0;
  currentFlow: FlowModel;

  constructor(private resolver: ComponentFactoryResolver) {}

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
}
