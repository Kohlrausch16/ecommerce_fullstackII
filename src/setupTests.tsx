import "@testing-library/jest-dom";

global.fetch = jest.fn();

// Mock do Header
jest.mock("./views/components/Header", () => () => <div data-testid="header-mock" />);