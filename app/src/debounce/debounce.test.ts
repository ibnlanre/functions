import { debounce } from "./debounce";
import { afterAll, expect, test, vi } from "vitest";

afterAll(() => {
  vi.useRealTimers();
});

test("Debounced callback should be called after the specified delay", () => {
  vi.useFakeTimers();

  const callback = vi.fn();
  const debounced = debounce(callback, { delay: 100 });

  debounced();

  expect(callback).not.toBeCalled();

  vi.advanceTimersByTime(100);

  expect(callback).toBeCalled();
});

test("Debounced callback should be immediately called if delay is 0", () => {
  vi.useFakeTimers();

  const callback = vi.fn();
  const debounced = debounce(callback, { delay: 0 });

  debounced();

  expect(callback).toBeCalled();
});

test("Debounced callback should be called only once if leading is true and trailing is fals", () => {
  vi.useFakeTimers();

  const callback = vi.fn();
  const debounced = debounce(callback, {
    delay: 100,
    leading: true,
    trailing: false,
  });

  debounced();
  debounced();
  debounced();

  expect(callback).toBeCalledTimes(1);

  vi.advanceTimersByTime(100);

  expect(callback).toBeCalledTimes(1);
});

test("Debounced callback should be called twice if leading is true and trailing is true", () => {
  vi.useFakeTimers();

  const callback = vi.fn();
  const debounced = debounce(callback, { delay: 100, leading: true });

  debounced();
  debounced();
  debounced();

  expect(callback).toBeCalledTimes(1);

  vi.advanceTimersByTime(100);

  expect(callback).toBeCalledTimes(2);
});

test("Debounced callback should be called on both leading and trailing edge if trailing is true", () => {
  vi.useFakeTimers();

  const callback = vi.fn();
  const debounced = debounce(callback, {
    delay: 100,
    trailing: true,
  });

  debounced();
  expect(callback).not.toBeCalled();

  vi.advanceTimersByTime(100);
  expect(callback).toBeCalled();

  debounced();
  expect(callback).toBeCalledTimes(1);

  vi.advanceTimersByTime(100);
  expect(callback).toBeCalledTimes(2);
});
