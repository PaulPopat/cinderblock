import { Entity, EntityNamespace } from "#ast";
import { _empty } from "./ast/EntryContext.ts";

export class App extends EntityNamespace {
  constructor(entities: Array<Entity>) {
    super(_empty(), "", entities);
  }
}
