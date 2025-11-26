import "@testing-library/jest-dom";

// Mock global do fetch
global.fetch = jest.fn();

// Mock correto do Header
jest.mock("./views/components/Header", () => () => <div data-testid="header-mock" />);
