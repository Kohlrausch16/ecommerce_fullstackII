import "@testing-library/jest-dom";

// Mock global do fetch (caso algum serviço use)
global.fetch = jest.fn();

// Mock do Header usado no AdminDashboard
jest.mock("../components/Header", () => () => <div data-testid="header-mock" />);