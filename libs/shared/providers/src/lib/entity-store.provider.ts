import { createEntityAdapter, EntityAdapter, EntityState, IdSelector, Update } from '@ngrx/entity';
import { BaseState } from './base-state.interface';
import { Observable } from 'rxjs';
import { StoreProvider } from './store.provider';
import { Injectable, Signal } from '@angular/core';
import { Dictionary } from '@ngrx/entity/src/models';

@Injectable()
export abstract class EntityStoreProvider<Entity, State = object> extends StoreProvider<
  EntityState<Entity> & BaseState & State
> {
  protected readonly initialState: BaseState & State = {} as BaseState & State;
  protected readonly selectId?: IdSelector<Entity>;
  protected readonly adapter: EntityAdapter<Entity> = createEntityAdapter({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selectId: (entity) => this.selectId?.(entity) || (entity as any).id || (entity as any).Id,
  });
  protected readonly adapterSelectors = this.adapter.getSelectors();
  readonly entities$: Observable<Entity[]> = this.select(this.adapterSelectors.selectAll);
  readonly entities: Signal<Entity[]> = this.selectSignal(this.adapterSelectors.selectAll);
  readonly entityDictionary: Signal<Dictionary<Entity>> = this.selectSignal(this.adapterSelectors.selectEntities);

  readonly setAll = this.updater((state, entities: Entity[]) => this.adapter.setAll(entities, state));
  readonly addOne = this.updater((state, entity: Entity) => this.adapter.addOne(entity, state));
  readonly upsertOne = this.updater((state, entity: Entity) => this.adapter.upsertOne(entity, state));
  readonly updateOne = this.updater((state, entity: Update<Entity>) => this.adapter.updateOne(entity, state));
  readonly updateMany = this.updater((state, entities: Update<Entity>[]) => this.adapter.updateMany(entities, state));
  readonly removeOne = this.updater((state, id: number | string) =>
    this.adapter.removeOne(id as number & string, state),
  );
  readonly removeMany = this.updater((state, ids: number[] | string[]) =>
    this.adapter.removeMany(ids as number[] & string[], state),
  );
  readonly removeAll = this.updater((state) => this.adapter.removeAll(state));

  constructor() {
    super();
    this.setState(this.adapter.getInitialState(this.initialState));
  }
}
