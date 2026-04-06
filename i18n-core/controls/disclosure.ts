export type DisclosureState = {
  readonly open: boolean;
};

export type DisclosureAction =
  | { readonly type: 'open' }
  | { readonly type: 'close' }
  | { readonly type: 'toggle' };

export function createDisclosureState(open = false): DisclosureState {
  return { open };
}

export function reduceDisclosureState(
  state: DisclosureState,
  action: DisclosureAction,
): DisclosureState {
  switch (action.type) {
    case 'open':
      return state.open ? state : { open: true };
    case 'close':
      return state.open ? { open: false } : state;
    case 'toggle':
      return { open: !state.open };
    default:
      return state;
  }
}
