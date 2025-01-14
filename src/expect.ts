import { throws } from 'node:assert'

type ToBeOrNotToBe = {
  toBe: (val: any) => boolean;
  notToBe: (val: any) => boolean;
};

const expect = function(val: any): ToBeOrNotToBe {
    const expectObj: object = {
      toBe: val === val.toBe ? () => true : throws("Not Equal"),
      notToBe: val !== val.notToBe ? () => true : throws('Equal')
    }
  }
;


expect(5).toBe(5); // true
expect(5).notToBe(5); // throws "Equal"
