import { Stack } from '../stack';

describe('Stack', () => {
  let stack: Stack<number>;
  
  beforeEach(() => {
    stack = new Stack<number>();
  });

  test('should be instanced with all values by default', () => {
    expect(stack).not.toBeUndefined(); 
    expect(stack.entries()).toEqual([]);
    expect(stack.peek()).toBeUndefined(); 
  });

  test('should support being instantiated with a seed stack', () => {
    const stack = new Stack([6, 4, 3, 1]);
    expect(stack.entries()).toEqual([6, 4, 3, 1]);
  });

  test('should support being instantiated with a custom buffer size', () => {
    const stack = new Stack([6, 4, 3, 1], 3);
    expect(stack.entries()).toEqual([6, 4, 3]);
  });

  test('should retrieve the internal collection capped to the size informed in the method', () => {
    const stack = new Stack([6, 4, 3, 1]);
    expect(stack.entries()).toEqual([6, 4, 3, 1]);
    expect(stack.entries(2)).toEqual([6, 4]);
  });

  test('should stack items to the internal collection via the add() method', () => {
    stack.add(568);
    stack.add(125);
    stack.add(8);
    expect(stack.entries()).toEqual([8, 125, 568]);
  });

  test('should ensure the internal collection honors the buffer size upon adding new items', () => {
    const stack = new Stack<number>(undefined, 4);
    stack.add(568);
    stack.add(125);
    stack.add(8);
    stack.add(69);
    stack.add(47);
    expect(stack.entries()).toEqual([47, 69, 8, 125]);
  });

  test('should return the Stack value as the return type of the add() method', () => {
    stack.add(8);
    stack.add(69);
    expect(stack.add(47)).toEqual([47, 69, 8]);
  });

  test('should empty the Stack after running the clear() method', () => {
    stack.add(568);
    stack.add(125);
    stack.add(8);
    stack.clear();

    expect(stack.entries()).toEqual([]);
  });

  test('should return the top element in the stack via the peek() method', () => {
    stack.add(568);
    stack.add(125);
    stack.add(8);
    expect(stack.peek()).toEqual(8);
  });

  test('should return undefined via the peek() method if the Stack is empty or just cleared', () => {
    expect(stack.peek()).toBeUndefined();

    stack.add(568);
    stack.add(125);
    stack.clear();
    expect(stack.peek()).toBeUndefined();
  });

  test('should override the Stack buffer via resize(), shrinking its internal collection if necessary', () => {
    stack.add(568);
    stack.add(125);
    stack.add(8);
    stack.add(69);
    stack.add(47);

    stack.resize(3);

    expect(stack.entries()).toEqual([47, 69, 8]);
  });
});