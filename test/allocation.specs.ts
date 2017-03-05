/** Copyright 2016 Jim Armstrong (www.algorithmist.net)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Specs for Typescript Math Toolkit item allocation classes - note that in
// the current alpha, TSMT$ItemAllocation and TSMT$Knapsack are completely
// separate (but obviously overlapping) classes - in a future release, they
// will derive from a common base class, which will compress these specs.

// test functions/classes
import {TSMT$AllocatableItem       } from '../src/AllocatableItem';
import {TSMT$IAllocatableItemProps } from '../src/IAllocatableItemProps';
import {TSMT$ItemAllocation        } from '../src/ItemAllocation';
import {TSMT$Knapsack              } from '../src/Knapsack';

import * as Chai from 'chai';
const expect = Chai.expect;

// Test Suites
describe('Allocatable Item Tests', () => {

  let value1: any    = "abc";
  let value2: any    = null;
  let value3: number = -1;

  it('properly constructs a new item', () => {
    let item: TSMT$AllocatableItem = new TSMT$AllocatableItem();

    expect(item).to.not.equal(null);
    expect(item.capacity).to.equal(0);
    expect(item.payoff).to.equal(0);
    expect(item.capacityRisk).to.equal(0);
    expect(item.payoffRisk).to.equal(0);
  });

  it('item payoff mutator properly rejects invalid values', () => {
    let item: TSMT$AllocatableItem = new TSMT$AllocatableItem();

    item.payoff = value1;
    expect(item.payoff).to.equal(0);

    item.payoff = value2;
    expect(item.payoff).to.equal(0);

    item.payoff = value3;
    expect(item.payoff).to.equal(0);
  });

  it('item capacity mutator properly rejects invalid values', () => {
    let item: TSMT$AllocatableItem = new TSMT$AllocatableItem();

    item.capacity = value1;
    expect(item.payoff).to.equal(0);

    item.capacity = value2;
    expect(item.payoff).to.equal(0);

    item.capacity = value3;
    expect(item.payoff).to.equal(0);
  });

  it('item payoff mutator properly accepts valid values', () => {
    let item: TSMT$AllocatableItem = new TSMT$AllocatableItem();

    item.payoff = 1.0;
    expect(item.payoff).to.equal(1.0);

    item.payoff = 0;
    expect(item.payoff).to.equal(0);
  });

  it('properly clones an Alllocatable Item', () => {
    let item: TSMT$AllocatableItem = new TSMT$AllocatableItem();

    item.capacity     = 3.0;
    item.payoff       = 100.0;
    item.capacityRisk = 1.0;
    item.payoffRisk   = 1.0;

    let item2: TSMT$AllocatableItem = item.clone();

    expect(item.capacity).to.equal(item2.capacity);
    expect(item.payoff).to.equal(item2.payoff);
    expect(item.capacityRisk).to.equal(item2.capacityRisk);
    expect(item.payoffRisk).to.equal(item2.payoffRisk);
  });

});

describe('Item Allocation Environment Tests', () => {

  let value1: any    = "abc";
  let value2: any    = null;
  let value3: number = -1;

  it('properly constructs a new item allocation environment', () => {
    let allocation: TSMT$ItemAllocation = new TSMT$ItemAllocation();

    expect(allocation).to.not.equal(null);
    expect(allocation.capacity).to.equal(0);
    expect(allocation.solutionCapacity).to.equal(0);
    expect(allocation.payoff).to.equal(0);
    expect(allocation.itemCount).to.equal(0);
  });

  it('properly clears an environment', () => {
    let allocation: TSMT$ItemAllocation = new TSMT$ItemAllocation();

    allocation.capacity = 10;
    allocation.clear();

    expect(allocation.capacity).to.equal(0);
    expect(allocation.solutionCapacity).to.equal(0);
    expect(allocation.payoff).to.equal(0);
    expect(allocation.itemCount).to.equal(0);
  });

  it('capacity mutator properly rejects invalid values', () => {
    let allocation: TSMT$ItemAllocation = new TSMT$ItemAllocation();

    allocation.capacity = value1;
    expect(allocation.payoff).to.equal(0);

    allocation.capacity = value2;
    expect(allocation.payoff).to.equal(0);

    allocation.capacity = value3;
    expect(allocation.payoff).to.equal(0);
  });

  it('adds items to the environment and returns correct count', () => {
    let allocation: TSMT$ItemAllocation = new TSMT$ItemAllocation();
    let item1: TSMT$AllocatableItem     = new TSMT$AllocatableItem();
    let item2: TSMT$AllocatableItem     = new TSMT$AllocatableItem();
    let item3: TSMT$AllocatableItem     = new TSMT$AllocatableItem();

    allocation.addItem(item1);
    allocation.addItem(item2);
    allocation.addItem(item3);
     
    expect(allocation.itemCount).to.equal(3);
  });

  it('returns correct count after removing an item', () => {
    let allocation: TSMT$ItemAllocation = new TSMT$ItemAllocation();
    let item1: TSMT$AllocatableItem     = new TSMT$AllocatableItem();
    let item2: TSMT$AllocatableItem     = new TSMT$AllocatableItem();
    let item3: TSMT$AllocatableItem     = new TSMT$AllocatableItem();

    allocation.addItem(item1);
    allocation.addItem(item2);
    allocation.addItem(item3);

    allocation.removeItem(item2);
     
    expect(allocation.itemCount).to.equal(2);
  });

  it('returns correct count after too many remove calls', () => {
    let allocation: TSMT$ItemAllocation = new TSMT$ItemAllocation();
    let item1: TSMT$AllocatableItem     = new TSMT$AllocatableItem();
    let item2: TSMT$AllocatableItem     = new TSMT$AllocatableItem();

    allocation.addItem(item1);
    allocation.addItem(item2);

    allocation.removeItem(item1);
    allocation.removeItem(item2);
    allocation.removeItem(item1);
     
    expect(allocation.itemCount).to.equal(0);
  });

  it('preserves item count after attempt to remove item not in environment', () => {
    let allocation: TSMT$ItemAllocation = new TSMT$ItemAllocation();
    let item1: TSMT$AllocatableItem     = new TSMT$AllocatableItem();
    let item2: TSMT$AllocatableItem     = new TSMT$AllocatableItem();
    let item3: TSMT$AllocatableItem     = new TSMT$AllocatableItem();

    allocation.addItem(item1);
    allocation.addItem(item2);

    allocation.removeItem(item3);
     
    expect(allocation.itemCount).to.equal(2);
  });

  it('returns empty array from item allocation with no items in environment', () => {
    let allocation: TSMT$ItemAllocation = new TSMT$ItemAllocation();

    let optimal: Array<TSMT$AllocatableItem> = allocation.allocate();
     
    expect(optimal.length).to.equal(0);
  });

  it('returns correct allocation with only one Item and full allowable capacity', () => {
    let allocation: TSMT$ItemAllocation = new TSMT$ItemAllocation();
    let item1: TSMT$AllocatableItem     = new TSMT$AllocatableItem();

    item1.name     = "item1";
    item1.capacity = 5;
   
    allocation.capacity = 10;   // entire environment capacity can be filled with the single item

    allocation.addItem(item1);

    let optimal: Array<TSMT$AllocatableItem> = allocation.allocate();  // note that capacity of the environment defaults to zero which means no allocation possible
    
    expect(optimal.length).to.equal(1);

    let item: TSMT$AllocatableItem = optimal[0];
    expect(item === item1).to.be.true;
  });

  it('returns correct allocation with one Item and partial allowable capacity', () => {
    let allocation: TSMT$ItemAllocation = new TSMT$ItemAllocation();
    let item1: TSMT$AllocatableItem     = new TSMT$AllocatableItem();

    item1.name     = "item1";
    item1.capacity = 5;
    item1.payoff   = 100;

    allocation.capacity = 2.5;   // entire environment capacity is filled with half of the single Item

    allocation.addItem(item1);

    let optimal: Array<TSMT$AllocatableItem> = allocation.allocate();  // note that capacity of the environment defaults to zero which means no allocation possible
    
    expect(optimal.length).to.equal(1);
    expect(allocation.payoff).to.equal(50);

    let item: TSMT$AllocatableItem = optimal[0];
    expect(item === item1).to.be.true;
    expect(item.solutionCapacity).to.equal(2.5);
    expect(item.solutionValue).to.equal(50);
  });

  it('returns correct allocation with two Items and full allowable capacity', () => {
    let allocation: TSMT$ItemAllocation = new TSMT$ItemAllocation();
    let item1: TSMT$AllocatableItem     = new TSMT$AllocatableItem();
    let item2: TSMT$AllocatableItem     = new TSMT$AllocatableItem();

    item1.name     = "item1";
    item1.capacity = 5;
    item1.payoff   = 100;

    item2.name     = "item2";
    item2.capacity = 8;
    item2.payoff   = 150;

    allocation.capacity = 20;   // both items do not consume full capacity of the environment

    allocation.addItem(item1);
    allocation.addItem(item2);

    let optimal: Array<TSMT$AllocatableItem> = allocation.allocate();  // note that capacity of the environment defaults to zero which means no allocation possible
    
    expect(optimal.length).to.equal(2);
    expect(allocation.payoff).to.equal(250);  // environment can accommodate entire capacity of both items
    
    let solution1: TSMT$AllocatableItem = optimal[0];
    expect(solution1 === item1).to.be.true;

    let solution2: TSMT$AllocatableItem = optimal[1];
    expect(solution2 === item2).to.be.true;
  });

  // now the fun begins ...
  it('returns correct allocation with two Items and only partial environment capacity #1', () => {
    let allocation: TSMT$ItemAllocation = new TSMT$ItemAllocation();
    let item1: TSMT$AllocatableItem     = new TSMT$AllocatableItem();
    let item2: TSMT$AllocatableItem     = new TSMT$AllocatableItem();

    item1.name     = "item1";
    item1.capacity = 5;
    item1.payoff   = 100;

    item2.name     = "item2";
    item2.capacity = 8;
    item2.payoff   = 150;

    // only part of item 1 may be consumed
    allocation.capacity = 4;

    allocation.addItem(item1);
    allocation.addItem(item2);

    let optimal: Array<TSMT$AllocatableItem> = allocation.allocate(); 
    
    expect(optimal.length).to.equal(1);
    expect(allocation.payoff).to.equal(80);
    
    let solution1: TSMT$AllocatableItem = optimal[0];
    expect(solution1 === item1).to.be.true;
    expect(solution1.solutionValue).to.equal(80);
    expect(solution1.solutionCapacity).to.equal(4);
  });

  it('returns correct allocation with two Items and only partial environment capacity #2', () => {
    let allocation: TSMT$ItemAllocation = new TSMT$ItemAllocation();
    let item1: TSMT$AllocatableItem     = new TSMT$AllocatableItem();
    let item2: TSMT$AllocatableItem     = new TSMT$AllocatableItem();

    item1.name     = "item1";
    item1.capacity = 5;
    item1.payoff   = 100;

    item2.name     = "item2";
    item2.capacity = 8;
    item2.payoff   = 150;

    // may consume all of item 1 and 3 parts of item 2
    allocation.capacity = 8;

    allocation.addItem(item1);
    allocation.addItem(item2);

    let optimal: Array<TSMT$AllocatableItem> = allocation.allocate();
    
    expect(optimal.length).to.equal(2);
    expect(allocation.payoff).to.equal(156.25);
    
    let solution1: TSMT$AllocatableItem = optimal[0];
    expect(solution1 === item1).to.be.true;
    expect(solution1.solutionValue).to.equal(100);
    expect(solution1.solutionCapacity).to.equal(5);

    let solution2: TSMT$AllocatableItem = optimal[1];
    expect(solution2 === item2).to.be.true;
    expect(solution2.solutionValue).to.equal(56.25);
    expect(solution2.solutionCapacity).to.equal(3);
  });

  it('returns correct allocation with two Items and only partial environment capacity #3', () => {
    let allocation: TSMT$ItemAllocation = new TSMT$ItemAllocation();
    let item1: TSMT$AllocatableItem     = new TSMT$AllocatableItem();
    let item2: TSMT$AllocatableItem     = new TSMT$AllocatableItem();

    // same as last test, but reverse the item properties
    item1.name     = "item1";
    item1.capacity = 8;
    item1.payoff   = 150;

    item2.name     = "item2";
    item2.capacity = 5;
    item2.payoff   = 100;

    allocation.capacity = 8;

    allocation.addItem(item1);
    allocation.addItem(item2);

    let optimal: Array<TSMT$AllocatableItem> = allocation.allocate();
    
    expect(optimal.length).to.equal(2);
    expect(allocation.payoff).to.equal(156.25);
    
    let solution1: TSMT$AllocatableItem = optimal[0];
    expect(solution1 === item2).to.be.true;
    expect(solution1.solutionValue).to.equal(100);
    expect(solution1.solutionCapacity).to.equal(5);

    let solution2: TSMT$AllocatableItem = optimal[1];
    expect(solution2 === item1).to.be.true;
    expect(solution2.solutionValue).to.equal(56.25);
    expect(solution2.solutionCapacity).to.equal(3);
  });

  it('returns correct allocation with arbitrary number of Items and specified capacity', () => {
    let allocation: TSMT$ItemAllocation = new TSMT$ItemAllocation();
    let item1: TSMT$AllocatableItem     = new TSMT$AllocatableItem();
    let item2: TSMT$AllocatableItem     = new TSMT$AllocatableItem();
    let item3: TSMT$AllocatableItem     = new TSMT$AllocatableItem();
    let item4: TSMT$AllocatableItem     = new TSMT$AllocatableItem();
    let item5: TSMT$AllocatableItem     = new TSMT$AllocatableItem();
    let item6: TSMT$AllocatableItem     = new TSMT$AllocatableItem();
    let item7: TSMT$AllocatableItem     = new TSMT$AllocatableItem();
    let item8: TSMT$AllocatableItem     = new TSMT$AllocatableItem();

    item1.name     = "item1";
    item1.capacity = 8.5;
    item1.payoff   = 20;

    item2.name     = "item2";
    item2.capacity = 5.0;
    item2.payoff   = 10;

    item3.name     = "item3";
    item3.capacity = 1.25;
    item3.payoff   = 40;

    item4.name     = "item4";
    item4.capacity = 4.0;
    item4.payoff   = 12;

    item5.name     = "item5";
    item5.capacity = 6.5;
    item5.payoff   = 26;

    item6.name     = "item6";
    item6.capacity = 15.0;
    item6.payoff   = 20;

    item7.name     = "item7";
    item7.capacity = 3.0;
    item7.payoff   = 14;

    item8.name     = "item8";
    item8.capacity = 1.0;
    item8.payoff   = 2;

    allocation.capacity = 30;

    allocation.addItem(item1);
    allocation.addItem(item2);
    allocation.addItem(item3);
    allocation.addItem(item4);
    allocation.addItem(item5);
    allocation.addItem(item6);
    allocation.addItem(item7);
    allocation.addItem(item8);

    let optimal: Array<TSMT$AllocatableItem> = allocation.allocate();
    
    expect(optimal.length).to.equal(8);
    expect(allocation.payoff).to.equal(125);
    
    let solution1: TSMT$AllocatableItem = optimal[0];
    expect(solution1 === item3).to.be.true;
    expect(solution1.solutionValue).to.equal(40);
    expect(solution1.solutionCapacity).to.equal(1.25);

    let solution2: TSMT$AllocatableItem = optimal[7];
    expect(solution2 === item6).to.be.true;
    expect(Math.abs(1-solution2.solutionValue)).to.be.lt(0.001);
    expect(solution2.solutionCapacity).to.equal(0.75);
  });
});

describe('0-1 Knapsack Tests', () => {

  let value1: any    = {};
  let value2: any    = null;
  let value3: number = -1;

  it('properly constructs a new 0-1 knapsack environment', () => {
    let allocation: TSMT$Knapsack = new TSMT$Knapsack();

    expect(allocation).to.not.equal(null);
    expect(allocation.capacity).to.equal(0);
    expect(allocation.solutionCapacity).to.equal(0);
    expect(allocation.payoff).to.equal(0);
    expect(allocation.itemCount).to.equal(0);
  });

  it('properly clears an environment', () => {
    let allocation: TSMT$Knapsack = new TSMT$Knapsack();

    allocation.capacity = 10;
    allocation.clear();

    expect(allocation.capacity).to.equal(0);
    expect(allocation.solutionCapacity).to.equal(0);
    expect(allocation.payoff).to.equal(0);
    expect(allocation.itemCount).to.equal(0);
  });

  it('capacity mutator properly rejects invalid values', () => {
    let allocation: TSMT$Knapsack = new TSMT$Knapsack();

    allocation.capacity = value1;
    expect(allocation.payoff).to.equal(0);

    allocation.capacity = value2;
    expect(allocation.payoff).to.equal(0);

    allocation.capacity = value3;
    expect(allocation.payoff).to.equal(0);
  });

  it('adds items to the environment and returns correct count', () => {
    let allocation: TSMT$Knapsack   = new TSMT$Knapsack();
    let item1: TSMT$AllocatableItem = new TSMT$AllocatableItem();
    let item2: TSMT$AllocatableItem = new TSMT$AllocatableItem();
    let item3: TSMT$AllocatableItem = new TSMT$AllocatableItem();

    allocation.addItem(item1);
    allocation.addItem(item2);
    allocation.addItem(item3);
     
    expect(allocation.itemCount).to.equal(3);
  });

  it('returns correct count after removing an item', () => {
    let allocation: TSMT$Knapsack   = new TSMT$Knapsack();
    let item1: TSMT$AllocatableItem = new TSMT$AllocatableItem();
    let item2: TSMT$AllocatableItem = new TSMT$AllocatableItem();
    let item3: TSMT$AllocatableItem = new TSMT$AllocatableItem();

    allocation.addItem(item1);
    allocation.addItem(item2);
    allocation.addItem(item3);

    allocation.removeItem(item2);
     
    expect(allocation.itemCount).to.equal(2);
  });

  it('returns correct count after too many remove calls', () => {
    let allocation: TSMT$Knapsack   = new TSMT$Knapsack();
    let item1: TSMT$AllocatableItem = new TSMT$AllocatableItem();
    let item2: TSMT$AllocatableItem = new TSMT$AllocatableItem();

    allocation.addItem(item1);
    allocation.addItem(item2);

    allocation.removeItem(item1);
    allocation.removeItem(item2);
    allocation.removeItem(item1);
     
    expect(allocation.itemCount).to.equal(0);
  });

  it('preserves item count after attempt to remove item not in environment', () => {
    let allocation: TSMT$Knapsack   = new TSMT$Knapsack();
    let item1: TSMT$AllocatableItem = new TSMT$AllocatableItem();
    let item2: TSMT$AllocatableItem = new TSMT$AllocatableItem();
    let item3: TSMT$AllocatableItem = new TSMT$AllocatableItem();

    allocation.addItem(item1);
    allocation.addItem(item2);

    allocation.removeItem(item3);
     
    expect(allocation.itemCount).to.equal(2);
  });

  it('returns empty solution array from item allocation with no items in environment', () => {
    let allocation: TSMT$Knapsack = new TSMT$Knapsack();

    let optimal: Array<TSMT$AllocatableItem> = allocation.allocate();
     
    expect(optimal.length).to.equal(0);
  });

  it('returns empty solution array with one item that exceeds environment capacity', () => {
    let allocation: TSMT$Knapsack   = new TSMT$Knapsack();
    let item1: TSMT$AllocatableItem = new TSMT$AllocatableItem();

    item1.capacity = 10;
    item1.payoff   = 100;

    allocation.capacity = 5;

    allocation.addItem(item1);

    let optimal: Array<TSMT$AllocatableItem> = allocation.allocate();
     
    expect(optimal.length).to.equal(0);
  });

  it('returns correct solution array with one item less than or equal to environment capacity', () => {
    let allocation: TSMT$Knapsack   = new TSMT$Knapsack();
    let item1: TSMT$AllocatableItem = new TSMT$AllocatableItem();

    item1.capacity = 4;
    item1.payoff   = 10;

    allocation.capacity = 5;

    allocation.addItem(item1);

    let optimal: Array<TSMT$AllocatableItem> = allocation.allocate();
     
    expect(optimal.length).to.equal(1);
  });

  it('returns correct solution for simple problem #1', () => {
    let allocation: TSMT$Knapsack   = new TSMT$Knapsack();
    let item1: TSMT$AllocatableItem = new TSMT$AllocatableItem();
    let item2: TSMT$AllocatableItem = new TSMT$AllocatableItem();
    let item3: TSMT$AllocatableItem = new TSMT$AllocatableItem();
    let item4: TSMT$AllocatableItem = new TSMT$AllocatableItem();

    allocation.addItem(item1);
    allocation.addItem(item2);
    allocation.addItem(item3);
    allocation.addItem(item4);

    item1.name     = "item1";
    item1.capacity = 5;
    item1.payoff   = 10;

    item2.name     = "item2";
    item2.capacity = 4;
    item2.payoff   = 40;

    item3.name     = "item3";
    item3.capacity = 6;
    item3.payoff   = 30;

    item4.name     = "item4";
    item4.capacity = 3;
    item4.payoff   = 50;

    allocation.capacity = 10;

    let optimal: Array<TSMT$AllocatableItem> = allocation.allocate();
     
    expect(allocation.payoff).to.equal(90);
    expect(optimal.length).to.equal(2);

    // because of backtracking, items will be added from the end of the list, forward
    let solution1: TSMT$AllocatableItem = optimal[0];
    expect(solution1===item4).to.be.true;
    expect(solution1.solutionCapacity).to.equal(solution1.capacity);
    expect(solution1.solutionValue).to.equal(solution1.payoff);
  });

  it('returns correct solution for simple problem #2', () => {
    let allocation: TSMT$Knapsack   = new TSMT$Knapsack();
    let item1: TSMT$AllocatableItem = new TSMT$AllocatableItem();
    let item2: TSMT$AllocatableItem = new TSMT$AllocatableItem();
    let item3: TSMT$AllocatableItem = new TSMT$AllocatableItem();
    let item4: TSMT$AllocatableItem = new TSMT$AllocatableItem();

    allocation.addItem(item1);
    allocation.addItem(item2);
    allocation.addItem(item3);
    allocation.addItem(item4);

    // reorder same data - alters how the value table is constructed, but same solution
    item1.name     = "item1";
    item1.capacity = 4;
    item1.payoff   = 40;

    item2.name     = "item2";
    item2.capacity = 5;
    item2.payoff   = 10;

    item3.name     = "item3";
    item3.capacity = 3;
    item3.payoff   = 50;

    item4.name     = "item4";
    item4.capacity = 6;
    item4.payoff   = 30;

    allocation.capacity = 10;

    let optimal: Array<TSMT$AllocatableItem> = allocation.allocate();
     
    expect(allocation.payoff).to.equal(90);
    expect(optimal.length).to.equal(2);

    // because of backtracking, items will be added from the end of the list, forward
    let solution1: TSMT$AllocatableItem = optimal[0];
    expect(solution1===item3).to.be.true;
    expect(solution1.solutionCapacity).to.equal(solution1.capacity);
    expect(solution1.solutionValue).to.equal(solution1.payoff);
  });

  it('returns correct solution for simple problem #3', () => {
    let allocation: TSMT$Knapsack   = new TSMT$Knapsack();
    let item1: TSMT$AllocatableItem = new TSMT$AllocatableItem();
    let item2: TSMT$AllocatableItem = new TSMT$AllocatableItem();
    let item3: TSMT$AllocatableItem = new TSMT$AllocatableItem();
    let item4: TSMT$AllocatableItem = new TSMT$AllocatableItem();

    item1.name     = "item1";
    item1.capacity = 2;
    item1.payoff   = 3;

    item2.name     = "item2";
    item2.capacity = 3;
    item2.payoff   = 4;

    item3.name     = "item3";
    item3.capacity = 4;
    item3.payoff   = 5;

    item4.name     = "item4";
    item4.capacity = 5;
    item4.payoff   = 6;

    allocation.addItem(item1);
    allocation.addItem(item2);
    allocation.addItem(item3);
    allocation.addItem(item4);

    allocation.capacity = 5;

    let optimal: Array<TSMT$AllocatableItem> = allocation.allocate();
     
    expect(allocation.payoff).to.equal(7);
    expect(optimal.length).to.equal(2);

    // because of backtracking, items will be added from the end of the list, forward
    let solution1: TSMT$AllocatableItem = optimal[0];
    expect(solution1===item2).to.be.true;
    expect(solution1.solutionCapacity).to.equal(solution1.capacity);
    expect(solution1.solutionValue).to.equal(solution1.payoff);
  });
});
