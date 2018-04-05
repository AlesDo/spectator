/**
 * @license
 * Copyright Netanel Basal. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NetanelBasal/spectator/blob/master/LICENSE
 */

import { TestModuleMetadata } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  template: ''
})
export class HostComponent {}

export type SpectatorOptions<T = any, H = HostComponent> = TestModuleMetadata & {
  component?: Type<T>;
  shallow?: boolean;
  disableAnimations?: boolean;
  host?: Type<H>;
  entryComponents?: any[];
};

const defaultOptions: SpectatorOptions<any, any> = {
  disableAnimations: true,
  shallow: false,
  host: HostComponent,
  entryComponents: []
};

export function initialModule<T, C = HostComponent>(options: SpectatorOptions<T, C> | Type<T>, withHost = false) {
  const merged = Object.assign({}, defaultOptions, options);
  let moduleMetadata: TestModuleMetadata & { entryComponents: any[] };
  let component;
  let host;

  if (typeof options === 'function') {
    component = options;
    host = HostComponent;
    moduleMetadata = {
      declarations: [component, withHost ? host : []],
      imports: [NoopAnimationsModule],
      schemas: [],
      providers: [],
      entryComponents: []
    };
  } else {
    component = merged.component;
    host = merged.host;

    moduleMetadata = {
      declarations: [component, withHost ? host : [], ...(merged.declarations || [])],
      imports: [merged.disableAnimations ? NoopAnimationsModule : [], ...(merged.imports || [])],
      schemas: [merged.shallow ? NO_ERRORS_SCHEMA : []],
      providers: [...(merged.providers || [])],
      entryComponents: [merged.entryComponents]
    };
  }

  return {
    moduleMetadata,
    component,
    host
  };
}
